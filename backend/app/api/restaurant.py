from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.schemas.restaurant import FinderInput, MealRecommendation
from backend.app.services.restaurant import find_restaurants
from backend.app.services.auth import get_current_user
from backend.app.db.session import get_db

router = APIRouter(tags = ["Restaurant"])

@router.post("/", response_model=List[MealRecommendation])
def run_finder(
    input: FinderInput,
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
    ):
    return find_restaurants(input, db, user.id) # type: ignore

