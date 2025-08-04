from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.models.user import User
from backend.app.schemas.dna_analysis import DnaAnalysisResult, DnaAnalysisCreate
from backend.app.services.dna_analysis import analyze_dna
from backend.app.services.auth import get_current_user
from backend.app.db.session import get_db

router = APIRouter(tags = ["Dna Analysis"])

@router.post("/run_analysis", response_model=DnaAnalysisResult)
def run_analysis(
    input: DnaAnalysisCreate,
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
    ):
    return analyze_dna(input, db, user.id) # type: ignore