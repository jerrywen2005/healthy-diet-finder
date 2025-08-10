from sqlalchemy.orm import Session
from backend.app.models.dna_analysis import DnaAnalysis
from backend.app.models.restaurant import RestaurantResult
from backend.app.schemas.dna_analysis import DnaAnalysisCreate
from backend.app.schemas.history import HistoryEntry
from backend.app.schemas.restaurant import MealRecommendation

def get_user_history(db: Session, user_id: int, history_type: list[str]) -> list[HistoryEntry]:
    selected_types = set(history_type) if history_type else {"restaurant", "dna", "grocery"}
    history = []
    if "restaurant" in selected_types:
        restaurants = db.query(RestaurantResult).filter(RestaurantResult.user_id == user_id).all()
        for restaurant in restaurants:
            history.append(HistoryEntry(
                id=restaurant.id, # type: ignore
                history_type="restaurant",
                created_at=restaurant.timestamp, # type: ignore
                input_data=None,
                result_data=MealRecommendation(
                    restaurant_name=restaurant.restaurant_name, # type: ignore
                    meal_name=restaurant.meal_name, # type: ignore
                    macros=restaurant.macros, # type: ignore
                    explanation=restaurant.explanation # type: ignore
                )
            ))

    if "dna" in selected_types:
        dnas = db.query(DnaAnalysis).filter(DnaAnalysis.user_id == user_id).all()
        for dna in dnas:
            history.append(HistoryEntry(
                id=dna.id, # type: ignore
                history_type="dna",
                created_at=dna.timestamp, # type: ignore
                input_data=DnaAnalysisCreate(
                    file_name=dna.file_name, # type: ignore
                    file_content=dna.file_content # type: ignore
                ),
                result_data=dna.analysis_result # type: ignore
            ))

    if "grocery" in selected_types:
        pass

    history.sort(key=lambda x: x.created_at, reverse=True)
    return history