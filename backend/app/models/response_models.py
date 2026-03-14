from pydantic import BaseModel
from typing import List, Optional

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

# --- Report models ---

class Breakpoint(BaseModel):
    concept: str
    trigger_question: str
    user_answer: str
    diagnosis: str

class ConceptNode(BaseModel):
    id: str
    label: str
    strength: str  # "strong" | "weak" | "partial"

class ConceptEdge(BaseModel):
    source: str
    target: str

class ConceptMap(BaseModel):
    root: str
    nodes: List[ConceptNode]
    edges: List[ConceptEdge]

class SessionReportResponse(BaseModel):
    mastery_score: int
    breakpoint: Optional[Breakpoint] = None
    concepts_to_review: List[str]
    concept_map: ConceptMap
