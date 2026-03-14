from pydantic import BaseModel

class SessionStartRequest(BaseModel):
    initial_explanation: str

class SessionAnswerRequest(BaseModel):
    session_id: str
    answer: str

class SessionReportRequest(BaseModel):
    session_id: str
