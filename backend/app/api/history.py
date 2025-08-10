from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.schemas.history import HistoryEntry
from backend.app.models.user import User
from backend.app.db.session import get_db
from backend.app.services.auth import get_current_user
from backend.app.services.history import get_user_history

router = APIRouter(tags = ["History"])

@router.get("/get_history", response_model=list[HistoryEntry])
def get_history(
    history_type: list[str] | None = Query(
        None,
        description="Filter by type: restaurant, dna, grocery"
    ),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Allow testing on OpenApi with one box
    selected_types = []
    for v in history_type: # type: ignore
        if v:
            selected_types.extend([s.strip() for s in v.split(",") if s.strip()])

    return get_user_history(db, user.id, selected_types) # type: ignore