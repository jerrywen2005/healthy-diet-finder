from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    # Add other fields