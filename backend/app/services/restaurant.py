import re
import json
from typing import List
from backend.app.schemas.restaurant import FinderInput, MealRecommendation
import openai
import requests
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.restaurant import RestaurantResult
from backend.env import NUTRITIONIX_API_KEY, GOOGLE_MAPS_API_KEY, NUTRITIONIX_APP_ID
from pathlib import Path

with open(Path(__file__).parents[1] / "data" / "menus.json", "r", encoding="utf-8") as f:
    menus = json.load(f)

def find_restaurants(input_data: FinderInput, db: Session, user_id: int):
    # Google Maps API to find nearby places
    places = get_nearby_restaurants(input_data.location, input_data.distance_range)

    # Nutritionix API to get menu nutrition data
    menu_items = get_nutritionix_data(places)

    # OpenAI API to rank and explain best meals
    best_meals = rank_meals_with_openai(menu_items, input_data)

    # 4. Save to DB
    for meal in best_meals:
        db_entry = RestaurantResult(
            user_id=user_id,
            restaurant_name=meal.restaurant_name,
            meal_name=meal.meal_name,
            macros=meal.macros,
            explanation=meal.explanation,
            timestamp=str(datetime.now())
        )
        db.add(db_entry)
    db.commit()

    return best_meals

# Convert location name to longitude latitude format
def geocode_location(address: str) -> str:
    address = address.strip()
    coord_pattern = r'^-?\d+(\.\d+)?,-?\d+(\.\d+)?$'

    if re.match(coord_pattern, address):
        return address
    else:
        res = requests.get("https://maps.googleapis.com/maps/api/geocode/json", params={
            "address": address,
            "key": GOOGLE_MAPS_API_KEY
        })
        results = res.json().get("results", [])
        if not results:
            raise ValueError("Invalid address")
        loc = results[0]['geometry']['location']
        return f"{loc['lat']},{loc['lng']}"

def get_nearby_restaurants(location: str, range: int) -> List[str]:
    location = geocode_location(location)
    radius = range*1609.34  # miles to meters
    response = requests.get(f"https://maps.googleapis.com/maps/api/place/nearbysearch/json", params={
        "location": location,
        "radius": radius,
        "type": "restaurant",
        "key": GOOGLE_MAPS_API_KEY
    })
    if response.status_code != 200:
        print("Google API error:", response.json())
        return []
    places = response.json().get("results", [])

    # Apply rating filter for better efficiency
    MIN_AVERAGE_RATING = 4.0
    MIN_RATINGS_COUNT = 20
    filtered_places = [
        place for place in places
        if place.get("rating", 0) >= MIN_AVERAGE_RATING and
           place.get("user_ratings_total", 0) >= MIN_RATINGS_COUNT
    ]
    
    for place in filtered_places:
        print(f"{place['name']} - Rating: {place.get('rating')} ({place.get('user_ratings_total')} reviews)")

    return [place['name'] for place in filtered_places]


def get_nutritionix_data(restaurant_names: List[str]):
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_API_KEY,
    }
    macros_data = []
    incomplete_items = []

    for restaurant_name in restaurant_names:
        search_response = requests.get(
            "https://trackapi.nutritionix.com/v2/search/instant",
            headers=headers,
            params={"query": restaurant_name}
        )
        # Using both branded and detail item requests to get the best of both worlds
        branded_items = search_response.json().get("branded", [])
        for item in branded_items[:3]:
            if is_junk_item(item["food_name"]):
                continue
            item_id = item.get("nix_item_id")
            menu_name = item.get("food_name")
            detail_macros = {}
            if item_id:
                detail_response = requests.get(
                    f"https://trackapi.nutritionix.com/v2/search/item?nix_item_id={item_id}",
                    headers=headers
                )
                foods = detail_response.json().get("foods", [])
                if foods:
                    detail_macros = {
                        "calories": foods[0].get("nf_calories"),
                        "protein": foods[0].get("nf_protein"),
                        "carbs": foods[0].get("nf_total_carbohydrate"),
                        "fats": foods[0].get("nf_total_fat"),
                        "fiber": foods[0].get("nf_dietary_fiber"),
                    }
            # Combine data: prefer detail, fallback to branded for missing macros
            macros = {
                "calories": fallback_macro(detail_macros.get("calories"), item.get("nf_calories")),
                "protein": fallback_macro(detail_macros.get("protein"), item.get("nf_protein")),
                "carbs": fallback_macro(detail_macros.get("carbs"), item.get("nf_total_carbohydrate")),
                "fats": fallback_macro(detail_macros.get("fats"), item.get("nf_total_fat")),
                "fiber": fallback_macro(detail_macros.get("fiber"), item.get("nf_dietary_fiber")),
            }
            # If any macro is missing, add to incomplete list for OpenAI
            if None in macros.values():
                incomplete_items.append({
                    "restaurant": restaurant_name,
                    "meal_name": menu_name,
                    "macros": macros
                })
            else:
                macros_data.append({
                    "restaurant": restaurant_name,
                    "meal_name": menu_name,
                    "macros": macros
                })

    # Batch OpenAI fill for all missing macro items in one request
    if incomplete_items:
        print("Sending to OpenAI (incomplete):", incomplete_items)
        completed = openai_fill_missing_macros(incomplete_items)
        macros_data.extend(completed)

    print("Returning macros_data:", macros_data)

    return macros_data

# Since 'or' treats '0' as false
def fallback_macro(a, b):
    return a if a is not None else b

def openai_fill_missing_macros(incomplete_items):
    prompt = (
        "You are a nutritionist AI. For each menu item below, fill in any missing nutrition information "
        "(calories, protein, carbs, fats, fiber) as accurately as possible. Respond as a JSON array. "
        "Leave existing values as is, only fill in blanks.\n\n"
        + json.dumps(incomplete_items)
    )

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    content = response.choices[0].message.content
    return parse_openai_response(content) # type: ignore


def parse_openai_response(raw_response: str) -> List[MealRecommendation]:
    try:
        # Extract first JSON array found in the string
        match = re.search(r'\[\s*{.*?}\s*\]', raw_response, re.DOTALL)
        if match:
            json_str = match.group(0)
            data = json.loads(json_str)
        else:
            # If not found, try to parse whole string
            data = json.loads(raw_response)
        # Convert each dict into a MealRecommendation
        return [
            MealRecommendation(
                restaurant_name=item["restaurant"],
                meal_name=item["meal_name"],
                macros=item["macros"],
                explanation=item.get("explanation", "")
            )
            for item in data
        ]
    except Exception as e:
        print("Failed to parse OpenAI response as JSON:", e)
        print("Raw content:", raw_response)
        return []



def rank_meals_with_openai(menu_items, input_data: FinderInput):
    prompt = f"""
You are a nutritionist. Based on the following goals:
- Calories: {input_data.calorie_goal}
- Protein: {input_data.protein_goal}
- Carbs: {input_data.carb_goal}
- Fats: {input_data.fats_goal}
- Fiber: {input_data.fiber_goal}
- Preferences: {', '.join(input_data.dietary_preferences)}
- Budget: ${input_data.budget}

Rank the top 10 best choices. Include a 1-2 sentence explanation for each recommendation and the macros.

Return the output as a list of JSON objects with keys: restaurant, meal_name, macros (with calories, protein, carbs, fats, fiber), and explanation.

{menu_items}
"""
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
        {"role": "user", "content": prompt}
        ],
    )
    return parse_openai_response(str(response.choices[0].message.content))

# Filter out junk to speed up requests
def is_junk_item(name):
    JUNK_KEYWORDS = ["sauce", "ketchup", "dressing", "condiment", "mustard", "mayo", "butter", "gravy", "salt", "soda", "pop", "lemonade"]
    return any(word in name.lower() for word in JUNK_KEYWORDS)
