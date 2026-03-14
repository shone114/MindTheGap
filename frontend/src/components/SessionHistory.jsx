import React from 'react';
import './SessionHistory.css';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';

const SessionHistory = ({ onBack, sessions = [], onOpenReport }) => {
  const getScoreColor = (score) => {
    const hue = Math.max(0, Math.min(120, (score / 100) * 120));
    return `hsl(${hue}, 65%, 38%)`;
  };

  const formatDate = (isoOrTime) => {
    try {
      return new Date(isoOrTime).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return isoOrTime;
    }
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
          <p className="history-empty">
            No past sessions yet. Complete a session to see your history!
          </p>
        ) : (
          sessions.map((session, idx) => (
            <div
              key={session.session_id || idx}
              className="history-card glass-panel"
              onClick={() => onOpenReport && onOpenReport(session)}
              role={onOpenReport ? 'button' : undefined}
            >
              <div className="history-info">
                <h3>{session.topic}</h3>
                <span className="history-date">
                  {formatDate(session.timestamp || session.date)}
                </span>
              </div>
              <div className="history-score">
                <span className="score-value" style={{ color: getScoreColor(session.mastery_score ?? session.score ?? 0) }}>
                  {session.mastery_score ?? session.score ?? '?'}%
                </span>
                {onOpenReport && <ChevronRight size={16} style={{ color: 'var(--text-secondary)', marginLeft: 4 }} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
