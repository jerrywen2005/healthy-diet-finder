from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.schemas.user import UserCreate, UserLogin, UserInfo
from backend.app.models.user import User
from backend.app.db.session import get_db
from backend.app.services.auth import hash_password, verify_password, create_access_token, create_verification_token
from backend.app.services.email_service import send_verification_email
from typing import cast

router = APIRouter()

@router.post("/signup", response_model=UserInfo)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_pw)

    token = create_verification_token()
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        verification_token=token,
        is_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)


    send_verification_email(new_user.email, token) # type: ignore

    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password): # type: ignore
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not db_user.is_verified: # type: ignore
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")
    token = create_access_token({"user_id": db_user.id, "email": db_user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.verification_token == token).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Invalid or expired token")
    db_user.is_verified = True  # type: ignore
    db_user.verification_token = None  # type: ignore
    db.commit()
    return {"message": "Email verified! You can now log in."}
