from sqlalchemy.orm import Session

def get_user_history(db: Session, user_id: int):
    return  