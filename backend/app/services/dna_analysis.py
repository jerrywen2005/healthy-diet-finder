from datetime import datetime
import openai
from sqlalchemy.orm import Session
from backend.app.schemas.dna_analysis import DnaAnalysisCreate, DnaAnalysisResult
from backend.app.models.dna_analysis import DnaAnalysis



def analyze_dna(input_data: DnaAnalysisCreate, db: Session, user_id: int):
    # OpenAI API call to analyze DNA
    result = openai_analyze(input_data)

    # Add to DB

    db_entry = DnaAnalysis(
        user_id=user_id,
        file_name = result.file_name,
        file_content = result.file_content,
        analysis_result = result.analysis_result,
        timestamp=str(datetime.now())
    )
    db.add(db_entry)
    db.commit()

    return DnaAnalysisResult(
        file_name=db_entry.file_name, # type: ignore
        file_content=db_entry.file_content, # type: ignore
        analysis_result=db_entry.analysis_result, # type: ignore
    )

def openai_analyze(input_data: DnaAnalysisCreate)-> DnaAnalysisResult:
    prompt = f"""
    You are a human DNA analyzer. Based on the following human DNA sequence
    - DNA file content: {input_data.file_content}

    Create a personalized and detailed diet and workout split so that the user can better achieve their goals based on their specific body.


    Return the output as a string.
    """
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
    return DnaAnalysisResult(
        file_name = input_data.file_name,
        file_content = input_data.file_content,
        analysis_result = str(response.choices[0].message.content)
    )


