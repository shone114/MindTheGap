# MindTheGap — Product Requirements Document (PRD)

## 1. Product Overview

**MindTheGap** is an AI-powered learning diagnostic tool inspired by the Feynman technique. Instead of an AI teaching the user, the user teaches a concept to the AI. The system acts like a curious student and asks progressively deeper questions to probe the explanation.

The goal is to reveal **gaps in understanding** that traditional studying methods often miss. By analyzing explanations and responses, the system identifies weak reasoning, vague explanations, and missing conceptual links.

At the end of a session, the user receives a **diagnostic report** that includes:

* a mastery score
* detected weak concepts
* highlighted explanation breakpoints
* a concept map showing strengths and gaps

MindTheGap focuses on **diagnosing understanding**, not delivering explanations.

---

## 2. Problem Statement

Students often believe they understand a concept until they attempt to explain it clearly. Passive learning methods such as reading, watching lectures, or reviewing notes can create an illusion of understanding.

The Feynman technique addresses this by encouraging learners to **teach a concept in simple terms**. However, this normally requires another person asking questions.

MindTheGap simulates this interaction by providing an AI student that asks probing questions and analyzes the explanation process to detect gaps.

---

## 3. Core Value Proposition

MindTheGap turns explanation into a **measurable signal of understanding**.

Instead of simply answering questions or summarizing information, the system actively probes the learner’s reasoning and surfaces the exact points where understanding breaks down.

This creates a feedback loop where users can:

* explain concepts
* discover gaps in knowledge
* revisit weak areas
* strengthen conceptual understanding

---

## 4. Target Users

Primary users:

* students studying technical or academic subjects
* learners preparing for exams or interviews
* self-learners exploring complex topics

Secondary users:

* educators who want to test conceptual understanding
* professionals reviewing technical concepts

---

## 5. Core User Flow

1. User enters a **concept or topic** they want to explain.
2. User provides an **initial explanation** in their own words.
3. The AI generates a **probing question** based on the explanation.
4. The user answers the question.
5. Steps 3–4 repeat for a limited number of rounds.
6. The system analyzes the explanations and generates a **diagnostic report**.

---

## 6. Key Features

### 6.1 Concept Explanation Input

Users begin a session by entering a topic and explaining the concept in their own words.

Purpose:

* capture the user’s current understanding
* provide context for the questioning process

---

### 6.2 Socratic Questioning Engine

The AI behaves like a curious student and asks questions that probe deeper understanding.

The questioning follows a structured reasoning progression such as:

* clarification
* examples
* edge cases
* assumptions
* counterexamples

The goal is to test whether the explanation holds up under deeper scrutiny.

---

### 6.3 Adaptive Questioning

Questions are dynamically generated based on the user’s responses.

Examples:

* vague explanations trigger clarification questions
* strong explanations trigger deeper conceptual questions
* contradictions trigger challenge questions

This creates an adaptive interaction rather than a scripted sequence.

---

### 6.4 Explanation Analysis

The system analyzes responses to detect:

* vague reasoning
* missing key concepts
* incorrect assumptions
* oversimplifications

It also attempts to identify the **breakpoint** where the user’s understanding begins to weaken.

---

### 6.5 Knowledge Gap Detection

After the questioning rounds, the system extracts weak areas in the concept.

Examples:

Weak areas might include:

* missing sub-concepts
* misunderstood relationships
* incomplete explanations

These gaps form the basis of the diagnostic report.

---

### 6.6 Mastery Score

Each session generates a **concept mastery score** representing how well the user explained the topic.

This score is not meant to be academically precise, but to give users a rough signal of conceptual strength.

---

### 6.7 Concept Map Visualization

The system generates a structured representation of the concept showing:

* strong areas
* weak areas
* related sub-concepts

The concept map helps users visually understand where their knowledge is incomplete.

---

### 6.8 Session Report

At the end of each session, the user receives a summary including:

* mastery score
* detected weak concepts
* explanation breakpoints
* concept map

This serves as a diagnostic learning report.

---

## 7. Session Lifecycle

A typical session includes:

1. Topic input
2. Initial explanation
3. 2–4 rounds of AI questioning
4. Explanation analysis
5. Diagnostic report generation

Sessions are intentionally short to keep the interaction focused and efficient.

---

## 8. Data Storage (Local)

Session summaries may be stored locally on the user’s device to allow users to revisit past learning sessions.

Stored session data may include:

* topic
* date
* mastery score
* detected knowledge gaps
* concept map structure

This enables a simple learning history without requiring accounts or authentication.

---

## 9. Non-Goals (Hackathon Scope)

To keep the system focused and achievable during the hackathon, the following are explicitly out of scope:

* user authentication
* cloud databases
* multi-user collaboration
* offline AI processing
* full learning management system features

---

## 10. Future Extensions

Potential future directions include:

* integrating user-provided study materials
* long-term knowledge tracking across topics
* spaced repetition for weak concepts
* collaborative teaching sessions
* deeper concept graph generation

---

## 11. Success Criteria

For the hackathon MVP, success means:

* users can explain a concept
* the system generates probing questions
* the system identifies knowledge gaps
* the system produces a clear diagnostic report

If the demo successfully shows how the system reveals a conceptual gap in a user's explanation, the core objective is achieved.

---

## 12. Summary

MindTheGap is a learning tool designed to reveal the gaps between **what learners think they understand and what they can actually explain**.

By turning explanation into an interactive diagnostic process, the system helps learners identify weak points in their understanding and focus their study efforts more effectively.
