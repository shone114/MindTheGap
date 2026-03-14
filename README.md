# MindTheGap

**MindTheGap** is an AI-powered learning diagnostic tool inspired by the **Feynman Technique**. Instead of passively consuming information, users explain a concept to an AI “student” that asks targeted Socratic questions to uncover gaps in understanding.

The system analyzes explanations, probes deeper with conceptual questions, and identifies exactly where reasoning breaks down. At the end of a session, users receive a **diagnostic report** highlighting knowledge gaps and concepts to review.

---

# Why MindTheGap?

Many learners believe they understand a topic until they try to explain it clearly. Traditional study methods like reading notes, watching lectures, or summarizing content often create an **illusion of understanding**.

MindTheGap addresses this by turning explanation into a **diagnostic process**:

Explain → Get Challenged → Detect Gaps → Improve Understanding

Instead of teaching the user directly, the AI behaves like a **curious student**, asking questions until it finds where understanding fails.

---

# Key Features

### Socratic Questioning Engine

Users explain a concept and the AI asks increasingly deep conceptual questions to probe their reasoning.

### Knowledge Gap Detection

The system evaluates each answer and identifies the moment where conceptual understanding breaks down.

### Diagnostic Session Report

After each session, users receive a structured report including:

* **Understanding score**
* **Detected knowledge gap**
* **Concepts to review**
* **Concept mind map**

### Concept Mind Map

Visualizes the conceptual structure of the topic, highlighting areas of strong and weak understanding.

### Voice-Based Explanations

Users can speak their explanations using **speech-to-text**, making the interaction feel natural.

### Progressive Web App (PWA)

MindTheGap can be installed as an app and supports:

* offline access to session history
* offline viewing of session reports
* fast loading through caching

---

# How It Works

1. User chooses a topic and explains it in their own words.
2. The AI generates a probing question about the explanation.
3. The user answers verbally or by typing.
4. The system evaluates the response.
5. The AI continues probing deeper until a conceptual gap is detected.
6. A **session report** is generated highlighting weaknesses and key concepts.

---

# Tech Stack

### Frontend

* React
* Vite
* Progressive Web App (PWA)

### Backend

* Python
* FastAPI

### AI & APIs

* Gemini API (LLM reasoning and analysis)
* Google Speech-to-Text API (voice input)

### Data Storage

* In-memory session management (backend)
* IndexedDB / local storage (offline session history)

---

# Project Structure

```
mindthegap/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── service-worker.js
│
├── docs/
│   ├── prd.md
│   ├── techstack.md
│   ├── backend.md
│   └── pwa.md
│
└── README.md
```

---

# Installation

## Clone the repository

```
git clone https://github.com/yourusername/mindthegap.git
cd mindthegap
```

---

## Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will run on:

```
http://localhost:8000
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file in the backend directory:

```
GEMINI_API_KEY=your_gemini_key
GOOGLE_STT_API_KEY=your_speech_to_text_key
```

---

# Progressive Web App

MindTheGap can be installed as a PWA.

The install prompt appears **after the user completes their first learning session**.

PWA capabilities include:

* offline access to session history
* offline viewing of reports
* fast loading through caching

---

# Example Use Case

Topic: Neural Networks

User explanation:

> Neural networks learn patterns from data.

AI question:

> Why do neural networks need activation functions?

User answer:

> They make the network stronger.

Session report:

```
Understanding Score: 64%

Gap Detected:
Activation Functions

Concepts to Review:
- Activation Functions
- Gradient Descent
```

---

# Future Improvements

* long-term knowledge tracking across topics
* collaborative learning sessions
* deeper concept graph generation
* personalized learning recommendations

---

# Inspiration

MindTheGap is inspired by the **Feynman Technique**, a learning method that emphasizes explaining concepts in simple terms to test true understanding.

---

# License

MIT License

---

# Contributors

Built for a hackathon project focused on **scalable and adaptive learning systems**.
