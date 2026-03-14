import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import { colors } from '../theme/colors';
import './ChatSession.css';

const ChatSession = ({ topic, currentQuestion, appState, onStartAnswer, onStopAnswer, onFinish, onBack }) => {
  const isRecording = appState === 'RECORDING_ANSWER';
  const [displayedQuestion, setDisplayedQuestion] = useState(currentQuestion);
  const [flipState, setFlipState] = useState('idle');
  const prevQuestion = useRef(currentQuestion);

  useEffect(() => {
    if (currentQuestion && currentQuestion !== prevQuestion.current) {
      setFlipState('exit');
      const t1 = setTimeout(() => {
        setDisplayedQuestion(currentQuestion);
        setFlipState('enter');
        prevQuestion.current = currentQuestion;
      }, 350);
      const t2 = setTimeout(() => setFlipState('idle'), 750);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (!prevQuestion.current && currentQuestion) {
      setDisplayedQuestion(currentQuestion);
      prevQuestion.current = currentQuestion;
    }
  }, [currentQuestion]);

  return (
    <div className="flashcard-wrapper">
      <div className="fc-top-row">
        <button className="fc-back-btn glass-panel" onClick={onBack}>
          <ArrowLeft size={18} /> Home
        </button>
      </div>
      <div className="topic-label-row">
        <span className="topic-label">{topic}</span>
      </div>

      <div className={`question-card glass-panel flip-${flipState}`}>
        <p className="question-text">{displayedQuestion}</p>
      </div>

      <div className="flashcard-controls">
        <AudioRecorder
          isRecording={isRecording}
          onStart={onStartAnswer}
          onStop={onStopAnswer}
        />
        <button className="end-session-btn" onClick={onFinish}>
          <CheckCircle2 size={18} /> End Session
        </button>
      </div>
    </div>
  );
};

export default ChatSession;
