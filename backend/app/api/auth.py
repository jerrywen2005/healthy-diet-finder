from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserInfo
from app.models.user import User
from app.db.session import get_db
from app.services.auth import hash_password, verify_password, create_access_token
from typing import cast

router = APIRouter()

@router.post("/signup", response_model=UserInfo)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    

    if not db_user or not verify_password(user.password, cast(str, db_user.hashed_password)):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id": db_user.id, "email": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
