from pydantic import BaseModel

class DnaAnalysisCreate(BaseModel):
    file_name: str
    file_content: str

class DnaAnalysisResult(BaseModel):
    file_name: str
    file_content: str
    analysis_result: str

    class Config:
        from_attributes = True

