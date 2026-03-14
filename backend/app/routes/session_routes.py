from fastapi import APIRouter, HTTPException
from app.models.request_models import SessionStartRequest, SessionAnswerRequest, SessionReportRequest
from app.models.response_models import SessionStartResponse, SessionAnswerResponse, SessionReportResponse, AnswerAnalysis
from app.core.session_manager import session_manager
from app.services.gemini_service import gemini_service
from app.services.speech_service import speech_service

router = APIRouter(prefix="/api/v1/session", tags=["Session"])

from fastapi import UploadFile, File, Form

@router.post("/start", response_model=SessionStartResponse)
async def start_session(file: UploadFile = File(...)):
    try:
        # Step 1: Transcribe
        content = await file.read()
        transcript = speech_service.transcribe_audio(content)
        if not transcript:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
            
        # Step 2: Generate initial analysis
        analysis = gemini_service.process_initial_explanation(transcript)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    session_id = session_manager.create_session()
    
    session_manager.update_session(session_id, "topic", analysis["topic"])
    session_manager.update_session(session_id, "initial_explanation", transcript)
    
    # Store the first question
    session_manager.append_to_session_list(session_id, "questions", analysis["question"])
    
    return SessionStartResponse(
        session_id=session_id,
        topic=analysis["topic"],
        question=analysis["question"]
    )

@router.post("/answer", response_model=SessionAnswerResponse)
async def submit_answer(
    session_id: str = Form(...),
    file: UploadFile = File(...)
):
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session["status"] != "active":
        raise HTTPException(status_code=400, detail="Session is no longer active")

    try:
        # Step 1: Transcribe Answer
        content = await file.read()
        transcript = speech_service.transcribe_audio(content)
        if not transcript:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
            
        session_manager.append_to_session_list(session_id, "answers", transcript)
        
        # Step 2: Reconstruct minimal QA history
        questions = session["questions"]
        answers = session["answers"]
        
        # We only need the last question and answer for context size optimization, per user request.
        last_q = questions[-1] if questions else ""
        last_a = answers[-1] if answers else ""
        
        analysis_result = gemini_service.process_answer(
            topic=session["topic"],
            last_question=last_q,
            latest_answer=last_a,
            question_count=len(answers)
        )
        
        # HARD LIMIT: Never trust the LLM to enforce question limits.
        # Force-terminate after 3 answered questions regardless of LLM output.
        MAX_QUESTIONS = 4
        if len(answers) >= MAX_QUESTIONS:
            analysis_result["continue_questioning"] = False
            analysis_result["next_question"] = ""
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    session_manager.append_to_session_list(session_id, "analysis", analysis_result)
    
    if analysis_result["continue_questioning"]:
        session_manager.append_to_session_list(session_id, "questions", analysis_result["next_question"])
    else:
        session_manager.update_session(session_id, "status", "ready_for_report")

    return SessionAnswerResponse(
        continue_questioning=analysis_result["continue_questioning"],
        next_question=analysis_result["next_question"] if analysis_result["continue_questioning"] else None,
        analysis=AnswerAnalysis(
            understanding_level=analysis_result["understanding_level"],
            vague_reasoning=analysis_result["vague_reasoning"],
            missing_concepts=analysis_result["missing_concepts"]
        )
    )

@router.post("/report", response_model=SessionReportResponse)
async def generate_report(request: SessionReportRequest):
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # The last generated question is in session["questions"] but isn't answered yet
    # We slice up to match answers length
    qa_history = [{"q": q, "a": a} for q, a in zip(session["questions"], session["answers"])]
    
    try:
        report = gemini_service.generate_report(
            topic=session["topic"],
            initial_explanation=session["initial_explanation"],
            qa_history=qa_history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    session_manager.update_session(request.session_id, "status", "completed")
    
    return SessionReportResponse(
        mastery_score=report["mastery_score"],
        breakpoint=report.get("breakpoint"),
        concepts_to_review=report.get("concepts_to_review", []),
        concept_map=report["concept_map"]
    )
