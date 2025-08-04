from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class DnaAnalysis(Base):
    __tablename__ = "dna_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String)
    file_content = Column(Text)
    analysis_result = Column(Text)
    timestamp = Column(String)

    user = relationship("User")