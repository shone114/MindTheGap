import uuid
from typing import Dict, Any

class SessionManager:
    def __init__(self):
        # In-memory storage: session_id -> session_data
        self.sessions: Dict[str, Dict[str, Any]] = {}
    
    def create_session(self) -> str:
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "topic": None, # Will be extracted by LLM
            "initial_explanation": "",
            "questions": [],
            "answers": [],
            "analysis": [],
            "status": "active"
        }
        return session_id

    def get_session(self, session_id: str) -> Dict[str, Any]:
        return self.sessions.get(session_id)

    def update_session(self, session_id: str, key: str, value: Any):
        if session_id in self.sessions:
            self.sessions[session_id][key] = value
            
    def append_to_session_list(self, session_id: str, key: str, value: Any):
        """Append an item to a list in the session state."""
        if session_id in self.sessions and isinstance(self.sessions[session_id].get(key), list):
            self.sessions[session_id][key].append(value)

session_manager = SessionManager()
