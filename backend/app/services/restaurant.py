from typing import List
from backend.app.schemas.restaurant import FinderInput, MealRecommendation
import openai
import requests
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.restaurant import RestaurantResult
from backend.env import NUTRITIONIX_API_KEY, GOOGLE_MAPS_API_KEY, NUTRITIONIX_APP_ID, NUTRITIONIX_API_KEY


def find_restaurants(input_data: FinderInput, db: Session, user_id: int | None = None): # temporarily does not require authentication
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

def get_nearby_restaurants(location: str, range_str: str) -> List[str]:
    radius = 5000  # e.g., for "under 5 miles"
    response = requests.get(f"https://maps.googleapis.com/maps/api/place/nearbysearch/json", params={
        "location": location,
        "radius": radius,
        "type": "restaurant",
        "key": GOOGLE_MAPS_API_KEY
    })
    return [place['name'] for place in response.json().get("results", [])]

def get_nutritionix_data(restaurant_names: List[str]):
    # Call for each restaurant's known menu items
    results = []
    for name in restaurant_names:
        response = requests.get(f"https://trackapi.nutritionix.com/v2/search/instant", headers={
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_API_KEY,
        }, params={"query": name})
        results += response.json().get("branded", [])
    return results

def parse_openai_response(raw_response: str) -> List[MealRecommendation]:
    # Basic placeholder logic
    return [
        MealRecommendation(
            restaurant_name="Chipotle",
            meal_name="Chicken Bowl",
            macros={"calories": 500, "protein": 40, "carbs": 50, "fats": 18, "fiber": 8},
            explanation="This is a high-protein, moderate-calorie meal that fits your target."
        )
    ]


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
