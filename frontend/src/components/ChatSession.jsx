import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import './ChatSession.css';

const ChatSession = ({ topic, currentQuestion, appState, onStartAnswer, onStopAnswer, onFinish, onBack }) => {
  const isRecording = appState === 'RECORDING_ANSWER';
  // Track the displayed question separately so it stays visible during loading
  const [displayedQuestion, setDisplayedQuestion] = useState(currentQuestion);
  const [flipState, setFlipState] = useState('idle'); // idle | exit | enter
  const prevQuestion = useRef(currentQuestion);

  // When a new question arrives (after loading), do the flashcard flip
  useEffect(() => {
    if (currentQuestion && currentQuestion !== prevQuestion.current) {
      // New question arrived — run exit → swap → enter
      setFlipState('exit');
      const t1 = setTimeout(() => {
        setDisplayedQuestion(currentQuestion);
        setFlipState('enter');
        prevQuestion.current = currentQuestion;
      }, 350);
      const t2 = setTimeout(() => setFlipState('idle'), 750);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    // On first mount
    if (!prevQuestion.current && currentQuestion) {
      setDisplayedQuestion(currentQuestion);
      prevQuestion.current = currentQuestion;
    }
  }, [currentQuestion]);

  const handleStop = () => {
    onStopAnswer();
  };

  return (
    <div className="flashcard-wrapper">

      {/* Top row: back + topic on its own line below */}
      <div className="fc-top-row">
        <button className="fc-back-btn glass-panel" onClick={onBack}>
          <ArrowLeft size={18} /> Home
        </button>
      </div>
      <div className="topic-label-row">
        <span className="topic-label">{topic}</span>
      </div>

      {/* Question card — question always visible, flip animation on new question */}
      <div className={`question-card glass-panel flip-${flipState}`}>
        <p className="question-text">{displayedQuestion}</p>
      </div>

      {/* Bottom controls */}
      <div className="flashcard-controls">
        <AudioRecorder
          isRecording={isRecording}
          onStart={onStartAnswer}
          onStop={handleStop}
        />
        <button className="end-session-btn glass-panel" onClick={onFinish}>
          <CheckCircle2 size={18} /> End Session
        </button>
      </div>
    </div>
  );
};

export default ChatSession;
