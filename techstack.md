# MindTheGap — Tech Stack & System Architecture

## 1. Overview

MindTheGap is built using a **client–server architecture**. The frontend manages user interaction and visualization, while the backend orchestrates AI reasoning, session flow, and analysis.

The system is intentionally designed to stay **lightweight and modular** so it can be built quickly during the hackathon while still remaining extensible.

High-level system flow:

```id="flow1"
Frontend (React + Vite)
        ↓
FastAPI Backend (Python)
        ↓
External AI APIs
   • Gemini (LLM reasoning)
   • Google Speech-to-Text
```

The backend acts as the **central orchestration layer**, coordinating AI calls and returning structured outputs to the frontend.

---

# 2. Core Tech Stack

## Backend

Primary backend framework:

* **Python**
* **FastAPI**

Reasons for choosing FastAPI:

* high performance async framework
* automatic OpenAPI documentation
* easy request validation using Pydantic
* minimal boilerplate
* fast to build during hackathons

Supporting backend libraries:

* `pydantic` — request/response validation
* `httpx` or `requests` — external API communication
* `uvicorn` — ASGI server
* `python-dotenv` — environment variable loading

---

## Frontend

Frontend stack (handled separately by teammate):

* **React**
* **Vite**

Optional additions:

* **TypeScript**
* visualization libraries (e.g. React Flow, D3)

Frontend responsibilities:

* explanation interface
* question answering interface
* speech recording UI
* concept map visualization
* mastery score display
* session report visualization

Frontend communicates with the backend through **REST API endpoints**.

---

## AI Services

### LLM Reasoning

LLM provider:

* **Gemini API**

Responsibilities:

* generating probing questions
* analyzing explanations
* identifying conceptual gaps
* detecting vague reasoning
* producing concept structures
* generating final diagnostic reports

The backend controls prompt structure and orchestrates the questioning loop.

---

### Speech-to-Text

Speech recognition provider:

* **Google Speech-to-Text API**

Purpose:

* allow users to **speak their explanations and answers**
* convert spoken responses into text
* pass transcribed text into the AI reasoning pipeline

Speech interaction flow:

```id="flow2"
User speaks answer
↓
Frontend records audio
↓
Backend sends audio to Google STT
↓
Transcription returned
↓
Text passed into LLM analysis
```

Speech input is optional; users can still type responses.

---

# 3. System Architecture

High-level architecture diagram:

```id="flow3"
             ┌─────────────────────────┐
             │        Frontend         │
             │     React + Vite App    │
             └────────────┬────────────┘
                          │ REST API
                          ▼
             ┌─────────────────────────┐
             │        Backend          │
             │      FastAPI Server     │
             │                         │
             │ Session Management     │
             │ Prompt Construction    │
             │ AI Response Parsing    │
             │ Speech Processing      │
             └────────────┬────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 ┌───────────────────┐        ┌────────────────────┐
 │     Gemini API    │        │ Google Speech-to-Text │
 │ Question Engine   │        │ Speech Transcription │
 │ Concept Analysis  │        │                      │
 └───────────────────┘        └────────────────────┘
```

The backend coordinates the interaction between the frontend and AI services.

---

# 4. Backend Responsibilities

The backend is responsible for the core system logic.

Main responsibilities include:

### Session orchestration

Managing the learning session lifecycle.

```id="flow4"
Start Session
→ Initial explanation
→ Generate question
→ User answer
→ Analyze answer
→ Generate next question
→ Repeat loop
→ Generate final report
```

---

### Prompt construction

The backend constructs structured prompts instructing the AI to:

* behave as a curious student
* ask probing questions
* challenge vague explanations
* detect missing concepts
* produce structured diagnostic outputs

---

### Response parsing

LLM responses should ideally be parsed into structured outputs such as:

```id="flow5"
question
weak_concepts
breakpoints
concept_map
mastery_score
```

However, the exact schema is **not rigidly fixed**.

The coding agent implementing the backend may adapt:

* endpoint design
* JSON response structures
* internal data models

as needed to produce the most robust implementation.

The structures shown in this document are **guidelines rather than strict contracts**.

---

# 5. API Design (Initial Skeleton)

Base API path:

```id="api1"
/api/v1
```

Endpoints below describe the **expected interaction pattern**, but may evolve depending on implementation decisions.

---

## 5.1 Start Session

Creates a new explanation session.

```id="api2"
POST /api/v1/session/start
```

Example request:

```json id="json1"
{
  "topic": "Neural Networks",
  "initial_explanation": "Neural networks learn patterns from data..."
}
```

Example response:

```json id="json2"
{
  "session_id": "uuid",
  "first_question": "What mathematical operation does a neuron perform?"
}
```

---

## 5.2 Submit Answer

User answers a probing question.

```id="api3"
POST /api/v1/session/answer
```

Example request:

```json id="json3"
{
  "session_id": "uuid",
  "answer": "A neuron computes a weighted sum of inputs."
}
```

Example response:

```json id="json4"
{
  "next_question": "Why do we need activation functions?",
  "analysis": {
    "vague": false,
    "missing_concepts": ["activation functions"]
  }
}
```

The backend determines internally whether to continue questioning or finalize the session.

---

## 5.3 Generate Session Report

Produces the final diagnostic report.

```id="api4"
POST /api/v1/session/report
```

Example response:

```json id="json5"
{
  "mastery_score": 63,
  "weak_concepts": [
    "activation functions",
    "gradient descent"
  ],
  "breakpoints": [
    "Explanation became vague while discussing activation functions"
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

# 6. Session Storage (Backend)

For the hackathon MVP:

* sessions are stored **in memory**
* no database is required
* session data persists only during server runtime

Example structure:

```id="flow6"
sessions = {
   session_id: {
      topic,
      explanations[],
      questions[],
      answers[]
   }
}
```

Persistent storage may be added in future versions.

---

# 7. API Interaction Flow

Typical session flow:

```id="flow7"
User explains concept
↓
Frontend → /session/start
↓
Backend generates first question
↓
Frontend shows question
↓
User answers (typed or spoken)
↓
Speech converted to text via STT
↓
Frontend → /session/answer
↓
Backend analyzes response
↓
Backend generates next question
↓
Repeat questioning loop
↓
Frontend → /session/report
↓
Backend returns final diagnostic report
```

---

# 8. Environment Variables

Sensitive credentials are stored in environment variables.

Example `.env` file:

```id="env1"
GEMINI_API_KEY=your_key
GOOGLE_STT_API_KEY=your_key
LLM_MODEL=gemini-pro
API_VERSION=v1
```

These values are loaded using `python-dotenv`.

---

# 9. Running the Backend

Development server command:

```id="cmd1"
uvicorn main:app --reload
```

This runs the FastAPI server locally.

---

# 10. Future Scalability

The architecture allows easy extension later:

* database-backed session storage
* user accounts
* long-term learning analytics
* uploaded study material
* concept graph tracking across sessions
* improved speech interfaces

The backend is intentionally built as an **API-first system**, allowing the frontend to evolve independently.

---

# 11. Summary

MindTheGap uses a lightweight but extensible architecture:

* **React + Vite frontend**
* **FastAPI backend**
* **Gemini API for reasoning**
* **Google Speech-to-Text for spoken answers**

The backend orchestrates AI interactions and returns structured diagnostic data to the frontend, enabling a clear and responsive learning experience while keeping the system simple enough for rapid hackathon development.
