import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/v1";

const MicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const StopIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12"></rect>
  </svg>
);

function App() {
  const [appState, setAppState] = useState('LANDING'); // LANDING, RECORDING_INIT, LOADING_INIT, CHATTING, RECORDING_ANSWER, LOADING_ANSWER, REPORT
  const [sessionId, setSessionId] = useState(null);
  const [topic, setTopic] = useState("");
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async (nextState) => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setAppState(nextState);
    } catch (err) {
      console.error(err);
      setErrorMsg("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = (processFunc) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processFunc(audioBlob);
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processInitial = async (audioBlob) => {
    setAppState('LOADING_INIT');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const startRes = await axios.post(`${API_URL}/session/start`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSessionId(startRes.data.session_id);
      setTopic(startRes.data.topic);
      setCurrentQuestion(startRes.data.question);
      // We don't get the transcript back in this optimized flow, 
      // so for initial explanation we just denote the topic.
      setHistory([{ role: 'user', text: `(Audio Explanation Provided)` }]);
      setAppState('CHATTING');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || err.message || "Failed to process audio.");
      setAppState('LANDING');
    }
  };

  const processAnswer = async (audioBlob) => {
    setAppState('LOADING_ANSWER');

    // Optimistically update UI so user knows it's thinking
    setHistory(prev => [
      ...prev,
      { role: 'ai', text: currentQuestion },
      { role: 'user', text: `(Audio Answer Provided)` }
    ]);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('session_id', sessionId);

      const ansRes = await axios.post(`${API_URL}/session/answer`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!ansRes.data.continue_questioning) {
        getReport();
      } else {
        setCurrentQuestion(ansRes.data.next_question);
        setAppState('CHATTING');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || err.message || "Failed to process answer.");
      setAppState('CHATTING');
    }
  };

  const getReport = async () => {
    setAppState('LOADING_REPORT');
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_URL}/session/report`, { session_id: sessionId });
      setReport(res.data);
      setAppState('REPORT');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to generate report.");
      setAppState('CHATTING');
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel main-panel">
        <header className="header">
          <div className="logo">MindTheGap 🧠</div>
          {sessionId && <div className="session-badge">Session Active</div>}
        </header>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <div className="content-area">

          {appState === 'LANDING' && (
            <div className="landing-view fade-in">
              <h1 className="hero-text">What concept do you want to master today?</h1>
              <p className="subtitle">Speak freely. Teach the AI. Discover your gaps.</p>

              <div className="mic-wrapper mt-4">
                <button className="mic-btn pulse-ready" onClick={() => startRecording('RECORDING_INIT')}>
                  <MicIcon />
                </button>
                <div className="mic-hint">Tap to start explaining</div>
              </div>
            </div>
          )}

          {appState === 'RECORDING_INIT' && (
            <div className="recording-view fade-in">
              <h1 className="hero-text recording-text">Listening...</h1>
              <p className="subtitle">Explain your concept in your own words.</p>

              <div className="mic-wrapper mt-4">
                <button className="mic-btn recording" onClick={() => stopRecording(processInitial)}>
                  <StopIcon />
                </button>
                <div className="mic-hint">Tap to stop recording</div>
              </div>
            </div>
          )}

          {appState === 'LOADING_INIT' && (
            <div className="loading-view fade-in">
              <div className="spinner"></div>
              <h2 className="mt-3">Analyzing your explanation...</h2>
            </div>
          )}

          {['CHATTING', 'RECORDING_ANSWER', 'LOADING_ANSWER', 'LOADING_REPORT'].includes(appState) && (
            <div className="chatting-view fade-in">
              <div className="topic-header">
                <span className="label">Topic:</span> {topic}
              </div>

              <div className="chat-history">
                {history.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.role}`}>
                    {msg.text}
                  </div>
                ))}

                {appState === 'LOADING_ANSWER' && (
                  <div className="chat-bubble user loading-bubble">
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  </div>
                )}

                <div className="chat-bubble ai highlight-bubble">
                  {currentQuestion}
                </div>
              </div>

              <div className="controls-bar">
                {appState === 'CHATTING' && (
                  <>
                    <button className="action-btn end-btn" onClick={getReport}>End & Get Report</button>
                    <button className="mic-btn small" onClick={() => startRecording('RECORDING_ANSWER')}>
                      <MicIcon />
                    </button>
                  </>
                )}

                {appState === 'RECORDING_ANSWER' && (
                  <button className="mic-btn small recording" onClick={() => stopRecording(processAnswer)}>
                    <StopIcon />
                  </button>
                )}

                {appState === 'LOADING_REPORT' && (
                  <div className="spinner small"></div>
                )}
              </div>
            </div>
          )}

          {appState === 'REPORT' && report && (
            <div className="report-view fade-in">
              <h2 className="gradient-text">Diagnostic Report</h2>

              <div className="score-ring">
                <div className="score-value">{report.mastery_score}</div>
                <div className="score-label">Mastery Score</div>
              </div>

              <div className="report-grid mt-4">
                <div className="report-card">
                  <h3>Weak Concepts</h3>
                  {report.weak_concepts.length > 0 ? (
                    <ul className="chip-list">
                      {report.weak_concepts.map((c, i) => <li key={i} className="chip warning">{c}</li>)}
                    </ul>
                  ) : <p className="success-text">None identified! Great job.</p>}
                </div>

                <div className="report-card">
                  <h3>Breakpoints</h3>
                  {report.breakpoints.length > 0 ? (
                    <ul className="bullet-list">
                      {report.breakpoints.map((bp, i) => <li key={i}>{bp}</li>)}
                    </ul>
                  ) : <p className="success-text">Flawless demonstration.</p>}
                </div>
              </div>

              <div className="report-card mt-4" style={{ width: "100%", boxSizing: "border-box" }}>
                <h3>Concept Map Mastery</h3>
                {report.concept_map && report.concept_map.length > 0 ? (
                  <ul className="chip-list">
                    {report.concept_map.map((c, i) => (
                      <li key={i} className={`chip ${c.strength === 'weak' ? 'warning' : 'success'}`}>
                        {c.concept}
                      </li>
                    ))}
                  </ul>
                ) : <p className="subtitle">No concepts mapped.</p>}
              </div>

              <button className="action-btn mt-4 full-width" onClick={() => window.location.reload()}>
                Master Another Topic
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
