import React from 'react';
import './SessionHistory.css';
import { ArrowLeft, Clock } from 'lucide-react';

const SessionHistory = ({ onBack, sessions = [] }) => {
  const getScoreColor = (score) => {
    const hue = Math.max(0, Math.min(120, (score / 100) * 120));
    return `hsl(${hue}, 70%, 40%)`;
  };

  return (
    <div className="history-wrapper animate-slide-up">
      <div className="history-header">
        <button className="back-btn glass-panel" onClick={onBack}>
          <ArrowLeft size={20} /> Back
        </button>
        <h2><Clock size={24} className="inline-icon" /> Session History</h2>
      </div>

      <div className="history-list">
        {sessions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
            No past sessions yet. Complete a session to see your history!
          </p>
        ) : (
          sessions.map((session, idx) => (
            <div key={idx} className="history-card glass-panel">
              <div className="history-info">
                <h3>{session.topic}</h3>
                <span className="history-date">{session.date}</span>
              </div>
              <div className="history-score">
                <span className="score-value" style={{ color: getScoreColor(session.score) }}>
                  {session.score}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
