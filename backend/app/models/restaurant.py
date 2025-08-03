from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class RestaurantResult(Base):
    __tablename__ = "restaurant_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    restaurant_name = Column(String)
    meal_name = Column(String)
    macros = Column(JSON)  # example: {"calories": 500, "protein": 40, "carbs": 50, "fats": 18, "fiber": 8}
    explanation = Column(String)
    timestamp = Column(String)