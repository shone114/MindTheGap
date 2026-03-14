from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Dict
import json
from app.core.config import settings
from app.models.response_models import SessionReportResponse

class GeminiService:
    def __init__(self):
        # We handle cases where the key might not be set yet during initialization
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

    class InitialAnalysisResult(BaseModel):
        topic: str = Field(description="The main topic or concept being explained.")
        question: str = Field(description="A precise, specific probing question testing their conceptual reasoning (e.g., an edge case, a specific example, or challenging an assumption). Do not use vague prompts like 'can you elaborate'.")

    def process_initial_explanation(self, explanation: str) -> dict:
        if not self.client:
            raise ValueError("Gemini API key not configured")
        
        prompt = f"""
        You are a Socratic tutor diagnosing a student's understanding of a concept.
        This is a rigorous diagnostic test, not a generic conversation.
        The student has provided an initial explanation.
        
        Task 1: Identify the main topic the student is explaining.
        Task 2: Generate exactly ONE precise, specific question testing their depth of understanding. 
        - Use Socratic progression: Ask about an edge case, require a specific example, or challenge an underlying assumption.
        - NEVER ask just for a definition.
        - NEVER ask vague follow-ups like "Can you elaborate" or "Tell me more".
        
        Student's explanation: "{explanation}"
        """
        
        response = self.client.models.generate_content(
            model=settings.LLM_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=self.InitialAnalysisResult,
                temperature=0.7
            ),
        )
        
        return json.loads(response.text)

    class AnswerAnalysisResult(BaseModel):
        understanding_level: str = Field(description="Categorize as 'weak', 'moderate', or 'strong'.")
        vague_reasoning: bool = Field(description="True if the user's answer lacked specific conceptual depth.")
        missing_concepts: List[str] = Field(description="List of core sub-concepts they missed or misunderstood.")
        continue_questioning: bool = Field(description="Set to false ONLY when understanding_level is 'weak' (a clear conceptual failure). Missing concepts alone should NOT cause termination. Default to true.")
        next_question: str = Field(description="The next precise conceptual question. Use any missing_concepts to craft a targeted probe into that gap. Leave empty only if continue_questioning is false.")

    def process_answer(self, topic: str, last_question: str, latest_answer: str, question_count: int) -> dict:
        if not self.client:
            raise ValueError("Gemini API key not configured")
        
        prompt = f"""
        You are a Socratic tutor diagnosing understanding of: "{topic}".
        This is a structured diagnostic engine. Your ONLY goal is to find where their understanding breaks down.
        
        Last Question Asked: "{last_question}"
        Student's latest answer: "{latest_answer}"
        
        Task 1: Evaluate this specific answer. Is it 'strong', 'moderate', or 'weak'? Identify missing concepts and mark if their reasoning was vague.
        Task 2: Decide if you should continue_questioning. You should almost always continue questioning unless the answer shows a clear conceptual misunderstanding or incorrect reasoning. STOP (return false) ONLY if their understanding_level is 'weak'. Missing concepts are normal in early explanations — they should drive the next question, not terminate the session.
        Task 3: If continue_questioning is true, provide the next_question. Use any missing concepts to create the next specific probing question (e.g., an edge case or challenging an assumption). NO generic "can you explain further?" prompts. If continue_questioning is false, leave next_question empty.
        """
        
        response = self.client.models.generate_content(
            model=settings.LLM_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=self.AnswerAnalysisResult,
                temperature=0.7
            ),
        )
        
        return json.loads(response.text)

    def generate_report(self, topic: str, initial_explanation: str, qa_history: List[Dict[str, str]]) -> dict:
        if not self.client:
            raise ValueError("Gemini API key not configured")
            
        history_text = f"Initial Explanation: {initial_explanation}\n\n"
        history_text += "\n".join([f"Q: {qa['q']}\nA: {qa['a']}" for qa in qa_history])
        
        prompt = f"""
        You are a diagnostic learning evaluator. Review this entire conversation where a student explains "{topic}".
        
        Conversation:
        {history_text}
        
        Provide a final diagnostic report including:
        1. A mastery score out of 100 based on their demonstrated depth, accuracy, and clarity.
        2. A list of weak concepts they struggled with.
        3. A list of exact "breakpoints" where their understanding broke down (e.g. "Started struggling when asked about X").
        4. A concept map representing the sub-concepts of the topic. Output this as a list of objects, each containing a 'concept' (string) and its 'strength' (string: 'strong' or 'weak').
        """
        
        response = self.client.models.generate_content(
            model=settings.LLM_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SessionReportResponse,
                temperature=0.2
            ),
        )
        
        return json.loads(response.text)

gemini_service = GeminiService()
