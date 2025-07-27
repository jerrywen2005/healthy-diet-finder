import re
from typing import List
from backend.app.schemas.restaurant import FinderInput, MealRecommendation
import openai
import requests
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.restaurant import RestaurantResult
from backend.env import NUTRITIONIX_API_KEY, GOOGLE_MAPS_API_KEY, NUTRITIONIX_APP_ID


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
    res = requests.get("https://maps.googleapis.com/maps/api/geocode/json", params={
        "address": address,
        "key": GOOGLE_MAPS_API_KEY
    })
    results = res.json().get("results", [])
    if not results:
        raise ValueError("Invalid address")
    loc = results[0]['geometry']['location']
    return f"{loc['lat']},{loc['lng']}"

def get_nearby_restaurants(location: str, range_str: str) -> List[str]:
    location = geocode_location(location)
    radius = 5000  # e.g., for "under 5 miles"
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

    return [place['name'] for place in places]


def get_nutritionix_data(restaurant_names: List[str]):
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_API_KEY,
    }
    macros_data = []
    failed_restaurants = set()

    for restaurant_name in restaurant_names:
        branded_items = []
        try:
            search_response = requests.get(
                "https://trackapi.nutritionix.com/v2/search/instant",
                headers=headers,
                params={"query": restaurant_name}
            )
            branded_items = search_response.json().get("branded", [])
        except Exception as e:
            print(f"Nutritionix request error for {restaurant_name}: {e}")
            failed_restaurants.add(restaurant_name)

        for item in branded_items[:3]:  # up to 3 menu items
            item_id = item.get("nix_item_id")
            if not item_id:
                failed_restaurants.add(restaurant_name)
                continue
            try:
                detail_response = requests.get(
                    f"https://trackapi.nutritionix.com/v2/search/item?nix_item_id={item_id}",
                    headers=headers
                )
                foods = detail_response.json().get("foods", [])
                if not foods:
                    continue
                food = foods[0]
                macros_data.append({
                    "restaurant": restaurant_name,
                    "meal_name": food.get("food_name"),
                    "macros": {
                        "calories": food.get("nf_calories"),
                        "protein": food.get("nf_protein"),
                        "carbs": food.get("nf_total_carbohydrate"),
                        "fats": food.get("nf_total_fat"),
                        "fiber": food.get("nf_dietary_fiber"),
                    }
                })
            except Exception as e:
                print(f"Nutritionix detail error for {restaurant_name}: {e}")
                failed_restaurants.add(restaurant_name)

    if failed_restaurants:
        ai_menu_data = openai_fill_missing(list(failed_restaurants))
        macros_data.extend(ai_menu_data)
 
    return macros_data

def openai_fill_missing(missing_restaurants: List[str]):
    import json
    prompt = (
    f"For each restaurant below, generate two plausible menu items with their estimated macros. For each, give:\n"
        "- restaurant_name\n"
        "- meal_name\n"
        "- calories, protein (g), carbs (g), fats (g), fiber (g)\n\n"
        f"Restaurants:\n"
        + "\n".join(missing_restaurants) +
    "\n\nRespond as a JSON array: "
    '[{"restaurant":"...", "meal_name":"...", "macros":{"calories":..., "protein":..., "carbs":..., "fats":..., "fiber":...}}]'
)

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    content = response.choices[0].message.content
    try:
        # Sometimes GPT puts markdown, so strip it out:
        if "```json" in content: # type: ignore
            content = content.split("```json")[1].split("```")[0].strip() # type: ignore
        elif "```" in content: # type: ignore
            content = content.split("```")[1].split("```")[0].strip() # type: ignore
        return json.loads(content) # type: ignore
    except Exception as e:
        print(f"OpenAI fallback parsing failed for {missing_restaurants}: {e}\nRaw content: {content}")
        return []


def parse_openai_response(raw_response: str) -> List[MealRecommendation]:
    pattern = re.compile(
        r"\d+\.\s*(.*?)\s*-\s*(.*?)\n\s*Macros:\s*(\d+)\s*calories,\s*(\d+)g protein,\s*(\d+)g carbs,\s*(\d+)g fats,\s*(\d+)g fiber\n\s*Explanation:\s*(.*?)\n?",
        re.MULTILINE
    )

    matches = pattern.findall(raw_response)
    parsed = []

    for restaurant, meal, cal, prot, carbs, fat, fiber, explanation in matches:
        macros = {
            "calories": float(cal),
            "protein": float(prot),
            "carbs": float(carbs),
            "fats": float(fat),
            "fiber": float(fiber),
        }
        parsed.append(MealRecommendation(
            restaurant_name=restaurant.strip(),
            meal_name=meal.strip(),
            macros=macros,
            explanation=explanation.strip()
        ))

    return parsed


def rank_meals_with_openai(menu_items, input_data: FinderInput):
    prompt = f"""
You are a nutritionist. Based on the following goals:
- Calories: {input_data.calorie_goal}
- Protein: {input_data.protein_goal}
- Carbs: {input_data.carb_goal}
- Fats: {input_data.fats_goal}
- Fiber: {input_data.fiber_goal}
- Preferences: {', '.join(input_data.dietary_preferences)}

Rank the following menu items from best to worst. Include a 1-2 sentence explanation for each recommendation and the macros.

Return the output as a list of JSON objects with keys: restaurant_name, meal_name, macros (with calories, protein, carbs, fats, fiber), and explanation.

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
