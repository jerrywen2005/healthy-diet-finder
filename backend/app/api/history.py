from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.schemas.history import HistoryEntry
from backend.app.models.user import User
from backend.app.db.session import get_db
from backend.app.services.auth import get_current_user
from backend.app.services.history import get_user_history

router = APIRouter(tags = ["History"])

@router.get("/history", response_model=List[HistoryEntry])
def get_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_user_history(db, user.id) # type: ignore