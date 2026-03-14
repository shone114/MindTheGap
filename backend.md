# MindTheGap — Backend Implementation Guide

## IMPORTANT SCOPE NOTE

This document describes **only the backend implementation** for MindTheGap.

The frontend will be developed separately by another team member. Therefore:

* Do **not** implement any frontend UI
* Do **not** include HTML templates
* Do **not** include frontend rendering logic
* Do **not** build a full web app

The backend must expose **clean REST API endpoints** that a future frontend (React + Vite) can easily integrate with.

Think of this backend as a **pure API service** responsible for orchestrating AI interactions and managing learning sessions.

---

# 1. Backend Responsibilities

The backend is responsible for:

1. Managing learning sessions
2. Calling external AI APIs
3. Generating probing questions
4. Analyzing user explanations
5. Detecting knowledge gaps
6. Producing structured diagnostic outputs
7. Handling speech transcription
8. Exposing clean API endpoints for the frontend

The backend **does not render UI**.

---

# 2. Backend Tech Stack

Primary technologies:

* **Python**
* **FastAPI**

Supporting libraries:

* `pydantic` — request and response validation
* `uvicorn` — ASGI server
* `httpx` or `requests` — API communication
* `python-dotenv` — environment variable management
* `uuid` — session IDs

External APIs:

* **Gemini API** — LLM reasoning and analysis
* **Google Speech-to-Text API** — speech transcription

---

# 3. Backend Architecture

The backend follows a simple layered architecture.

```id="arch1"
API Layer (FastAPI routes)
        ↓
Session Manager
        ↓
AI Service Layer
        ↓
External APIs (Gemini + Google STT)
```

### API Layer

Handles incoming requests from the frontend.

### Session Manager

Maintains the state of learning sessions.

### AI Service Layer

Handles prompt construction, API calls, and response parsing.

---

# 4. Project Folder Structure

Suggested backend project structure:

```id="arch2"
backend/
│
├── app/
│   ├── main.py
│   ├── routes/
│   │   └── session_routes.py
│   │
│   ├── services/
│   │   ├── gemini_service.py
│   │   ├── speech_service.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── session_manager.py
│   │
│   ├── models/
│   │   ├── request_models.py
│   │   └── response_models.py
│
├── .env
└── requirements.txt
```

This structure keeps responsibilities clean and modular.

---

# 5. Session Management

Sessions track the flow of a learning interaction.

Each session contains:

```id="sess1"
topic
initial_explanation
questions
answers
analysis
```

Sessions are stored **in memory** for the hackathon MVP.

Example structure:

```id="sess2"
sessions = {
   session_id: {
      "topic": "",
      "initial_explanation": "",
      "questions": [],
      "answers": [],
      "analysis": []
   }
}
```

No database is required.

---

# 6. API Endpoints

Base API path:

```id="api_base"
/api/v1
```

Endpoints described below are **guidelines**.
The implementing agent may modify them if a better design emerges.

---

## Start Session

Creates a new explanation session.

```id="api_start"
POST /api/v1/session/start
```

Input:

```json id="json_start_req"
{
  "topic": "Neural Networks",
  "initial_explanation": "Neural networks learn patterns from data."
}
```

Backend actions:

1. Create new session ID
2. Store session state
3. Send explanation to LLM
4. Generate first probing question

Response example:

```json id="json_start_res"
{
  "session_id": "uuid",
  "question": "What mathematical operation does a neuron perform?"
}
```

---

## Submit Answer

User answers a question.

```id="api_answer"
POST /api/v1/session/answer
```

Input:

```json id="json_answer_req"
{
  "session_id": "uuid",
  "answer": "A neuron computes a weighted sum of inputs."
}
```

Backend actions:

1. Store answer in session
2. Send explanation + answer to LLM
3. Generate analysis
4. Generate next probing question

Response example:

```json id="json_answer_res"
{
  "next_question": "Why are activation functions necessary?",
  "analysis": {
    "vague": false,
    "missing_concepts": ["activation functions"]
  }
}
```

---

## Generate Final Report

When questioning rounds finish.

```id="api_report"
POST /api/v1/session/report
```

Backend generates diagnostic summary.

Example response:

```json id="json_report_res"
{
  "mastery_score": 63,
  "weak_concepts": [
    "activation functions",
    "gradient descent"
  ],
  "breakpoints": [
    "Explanation became vague when discussing activation functions."
  ],
  "concept_map": {
    "neural_networks": {
      "forward_propagation": "strong",
      "activation_functions": "weak",
      "backpropagation": "weak"
    }
  }
}
```

---

# 7. Speech-to-Text Processing

Users may speak their explanations.

Speech flow:

```id="flow_speech"
User audio
↓
Frontend sends audio to backend
↓
Backend sends audio to Google STT
↓
Transcription returned
↓
Text used for LLM analysis
```

Suggested endpoint:

```id="api_speech"
POST /api/v1/speech/transcribe
```

Input:

audio file.

Output:

```json id="json_speech"
{
  "transcription": "Neural networks learn patterns from data."
}
```

---

# 8. Gemini Service

The Gemini service handles all LLM communication.

Responsibilities:

* construct prompts
* call Gemini API
* parse responses
* return structured outputs

Example tasks:

```id="gem_tasks"
generate_question()
analyze_explanation()
generate_final_report()
```

Prompts should instruct the model to:

* behave like a curious student
* ask probing questions
* detect vague explanations
* identify weak concepts
* output structured information when possible

---

# 9. Environment Variables

Configuration should be loaded from `.env`.

Example:

```id="env_vars"
GEMINI_API_KEY=xxxxx
GOOGLE_STT_API_KEY=xxxxx
LLM_MODEL=gemini-pro
```

Access via `python-dotenv`.

---

# 10. Running the Backend

Run the development server with:

```id="cmd_run"
uvicorn app.main:app --reload
```

This launches the FastAPI backend locally.

---

# 11. Error Handling

Backend should gracefully handle:

* AI API failures
* transcription failures
* invalid session IDs
* malformed requests

Example error response:

```json id="json_error"
{
  "error": "Session not found"
}
```

---

# 12. Flexibility for Implementation

Important: the structures described here are **guidelines, not rigid constraints**.

The implementing agent is allowed to adjust:

* endpoint names
* request/response schemas
* internal session models
* prompt formats

if it leads to a cleaner or more reliable backend design.

The only requirement is that the backend exposes **clear, usable APIs for the frontend**.

---

# 13. Final Goal

The backend should provide a clean API capable of:

1. starting a learning session
2. generating probing questions
3. analyzing explanations
4. detecting knowledge gaps
5. producing a diagnostic learning report

All UI concerns are handled by the frontend, which will connect to this backend later.

Also tell me how to test this out without frontend.