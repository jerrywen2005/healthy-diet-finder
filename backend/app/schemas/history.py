from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class HistoryEntry(BaseModel):
    id: int
    history_type: str   # restaurant, dna, grocery
    created_at: datetime
    input_data: Dict[str, Any]
    result_data: Dict[str, Any]