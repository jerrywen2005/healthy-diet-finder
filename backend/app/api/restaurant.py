from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.schemas.restaurant import FinderInput, MealRecommendation
from backend.app.services.restaurant import find_restaurants
from backend.app.services.auth import get_current_user
from backend.app.db.session import get_db

router = APIRouter(prefix = "/restaurant", tags = ["restaurant"])

@router.post("/", response_model=List[MealRecommendation])
def run_finder(
    input: FinderInput,
    # db: Session = Depends(get_db), 
    user = Depends(get_current_user)
    ):
    return find_restaurants(input, db, user_id=None) # type: ignore # temporarily does not require authentication