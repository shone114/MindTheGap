import React from 'react';
import { Mic } from 'lucide-react';
import './AudioRecorder.css';

const AudioRecorder = ({ isRecording, onStart, onStop }) => {
  return (
    <div className="audio-recorder-wrapper">
      <button
        className={`record-button ${isRecording ? 'recording' : 'idle'}`}
        onClick={isRecording ? onStop : onStart}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        <Mic size={isRecording ? 48 : 36} className="mic-icon" />
      </button>
    </div>
  );
};

export default AudioRecorder;
