from pydantic import BaseModel
from typing import List, Optional, Dict

class FinderInput(BaseModel):
    calorie_goal: int
    protein_goal: Optional[int]
    carb_goal: Optional[int]
    fats_goal: Optional[int]
    fiber_goal: Optional[int]
    distance_range: int
    budget: int
    dietary_preferences: List[str]
    other_goals: List[str]
    time_of_day: str
    location: str

class MealRecommendation(BaseModel):
    restaurant_name: str
    meal_name: str
    macros: Dict[str, float]
    explanation: str
