from pydantic import BaseModel
from datetime import datetime

from backend.app.schemas.dna_analysis import DnaAnalysisCreate
from backend.app.schemas.restaurant import MealRecommendation

class HistoryEntry(BaseModel):
    id: int
    history_type: str   # restaurant, dna, grocerys
    created_at: datetime
    input_data: DnaAnalysisCreate | None
    result_data: MealRecommendation | str