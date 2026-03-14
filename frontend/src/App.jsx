import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Brain, Clock, Activity } from 'lucide-react';
import AudioRecorder from './components/AudioRecorder';
import ChatSession from './components/ChatSession';
import DiagnosticReport from './components/DiagnosticReport';
import SessionHistory from './components/SessionHistory';
import './App.css';

const API_URL = "http://127.0.0.1:8000/api/v1";

function App() {
  const [appState, setAppState] = useState('landing'); // landing | recording | loading | chatting | RECORDING_ANSWER | LOADING_ANSWER | LOADING_REPORT | report | history
  const [sessionId, setSessionId] = useState(null);
  const [topic, setTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessions, setSessions] = useState([]); // session history list

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async (nextState) => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setAppState(nextState);
    } catch (err) {
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
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const processInitial = async (audioBlob) => {
    setAppState('loading');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      const res = await axios.post(`${API_URL}/session/start`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSessionId(res.data.session_id);
      setTopic(res.data.topic);
      setCurrentQuestion(res.data.question);
      setAppState('chatting');
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to process audio.");
      setAppState('landing');
    }
  };

  const processAnswer = async (audioBlob) => {
    setAppState('LOADING_ANSWER');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('session_id', sessionId);
      const res = await axios.post(`${API_URL}/session/answer`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (!res.data.continue_questioning) {
        await fetchReport();
      } else {
        setCurrentQuestion(res.data.next_question);
        setAppState('chatting');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to process answer.");
      setAppState('chatting');
    }
  };

  const fetchReport = async () => {
    setAppState('LOADING_REPORT');
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_URL}/session/report`, { session_id: sessionId });
      setReport(res.data);
      // Save to session history
      setSessions(prev => [{
        topic,
        score: res.data.mastery_score,
        date: new Date().toLocaleTimeString(),
      }, ...prev]);
      setAppState('report');
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to generate report.");
      setAppState('chatting');
    }
  };

  const handleReset = () => {
    setAppState('landing');
    setSessionId(null);
    setTopic("");
    setCurrentQuestion("");
    setReport(null);
    setErrorMsg("");
  };

  const isChatActive = ['chatting', 'RECORDING_ANSWER', 'LOADING_ANSWER', 'LOADING_REPORT'].includes(appState);

  return (
    <div className="app-container">
      {/* Ambient background blobs */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />

      <main className="main-content">

        {/* Header — only on landing */}
        {appState === 'landing' && (
          <header className="app-header">
            <Brain size={32} className="logo-icon" />
            <h1 className="text-gradient">MindTheGap</h1>
          </header>
        )}

        {/* History button — only on landing */}
        {appState === 'landing' && (
          <button className="history-icon-btn glass-panel" onClick={() => setAppState('history')} title="Session History">
            <Clock size={24} />
          </button>
        )}

        {errorMsg && <div className="error-toast">{errorMsg}</div>}

        <div className="state-container">

          {/* Landing */}
          {appState === 'landing' && (
            <div className="landing-view animate-slide-up">
              <h2 className="title">Explain a concept.</h2>
              <p className="subtitle">Speak freely. Uncover the gaps in your understanding.</p>
              <div className="mic-container">
                <AudioRecorder
                  isRecording={false}
                  onStart={() => startRecording('recording')}
                  onStop={() => {}}
                />
                <p className="mic-hint">Tap to begin your explanation</p>
              </div>
            </div>
          )}

          {/* Recording initial explanation */}
          {appState === 'recording' && (
            <div className="recording-view animate-slide-up">
              <div className="mic-container">
                <AudioRecorder
                  isRecording={true}
                  onStart={() => {}}
                  onStop={() => stopRecording(processInitial)}
                />
                <p className="mic-hint">Tap to stop recording</p>
              </div>
            </div>
          )}

          {/* Initial loading */}
          {appState === 'loading' && (
            <div className="loading-view animate-slide-up">
              <Activity size={48} className="spinner-icon" />
              <h2>Analyzing your reasoning...</h2>
              <p className="subtitle text-gradient">Looking for conceptual gaps</p>
            </div>
          )}

          {/* Chat session — includes recording / loading answer states */}
          {isChatActive && (
            <div className="chatting-view animate-slide-up">
              <ChatSession
                topic={topic}
                currentQuestion={appState === 'LOADING_REPORT' ? '' : currentQuestion}
                appState={appState}
                onStartAnswer={() => startRecording('RECORDING_ANSWER')}
                onStopAnswer={() => stopRecording(processAnswer)}
                onFinish={fetchReport}
                onBack={handleReset}
              />
              {appState === 'LOADING_REPORT' && (
                <div className="loading-view" style={{ position: 'absolute', bottom: '2rem', width: '100%' }}>
                  <Activity size={32} className="spinner-icon" />
                </div>
              )}
            </div>
          )}

          {/* Report */}
          {appState === 'report' && report && (
            <div className="report-view animate-slide-up">
              <DiagnosticReport data={report} />
              <button className="reset-btn glass-panel" onClick={handleReset}>
                New Session
              </button>
            </div>
          )}

          {/* History */}
          {appState === 'history' && (
            <SessionHistory
              sessions={sessions}
              onBack={() => setAppState('landing')}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
