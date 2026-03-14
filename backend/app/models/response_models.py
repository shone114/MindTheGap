from pydantic import BaseModel
from typing import List, Dict, Optional

class SessionStartResponse(BaseModel):
    session_id: str
    topic: str
    question: str

class AnswerAnalysis(BaseModel):
    understanding_level: str
    vague_reasoning: bool
    missing_concepts: List[str]

class SessionAnswerResponse(BaseModel):
    continue_questioning: bool
    next_question: Optional[str] = None
    analysis: AnswerAnalysis

class ConceptStrength(BaseModel):
    concept: str
    strength: str

class SessionReportResponse(BaseModel):
    mastery_score: int
    weak_concepts: List[str]
    breakpoints: List[str]
    concept_map: List[ConceptStrength]
