import React from 'react';
import { AlertTriangle, Target, Map, Home } from 'lucide-react';
import './DiagnosticReport.css';

const DiagnosticReport = ({ data, onHome, onViewMap }) => {
  return (
    <div className="report-wrapper">

      {/* Nav bar */}
      <div className="report-nav">
        <button className="report-home-btn glass-panel" onClick={onHome}>
          <Home size={16} /> Home
        </button>
        <h2 className="report-nav-title text-gradient">Session Diagnosis</h2>
      </div>

      {/* Mastery Score */}
      <div className="score-section glass-panel">
        <div className="score-circle">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="circle"
              strokeDasharray={`${data.mastery_score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="score-value-block">
            <span className="score-number">{data.mastery_score}</span>
            <span className="score-label">Mastery</span>
          </div>
        </div>
      </div>

      {/* Breakpoint Card */}
      {data.breakpoint ? (
        <div className="breakpoint-card glass-panel">
          <div className="bp-header">
            <AlertTriangle size={15} className="icon-warn" />
            <span className="bp-badge">Gap Detected</span>
            <span className="bp-concept-name">{data.breakpoint.concept}</span>
          </div>

          <div className="bp-body">
            <div className="bp-pill bp-pill--q">
              <span className="bp-pill-label">Q</span>
              <span>{data.breakpoint.trigger_question}</span>
            </div>
            <div className="bp-pill bp-pill--a">
              <span className="bp-pill-label">A</span>
              <span>"{data.breakpoint.user_answer}"</span>
            </div>
          </div>

          <p className="bp-diagnosis">{data.breakpoint.diagnosis}</p>
        </div>
      ) : (
        <div className="no-gap-card glass-panel">
          No significant gaps — solid session! 🎉
        </div>
      )}

      {/* Concepts to Review */}
      {data.concepts_to_review?.length > 0 && (
        <div className="concepts-section glass-panel">
          <div className="card-title">
            <Target size={15} className="icon-info" /> Review Next
          </div>
          <div className="chips-container">
            {data.concepts_to_review.map((c, i) => (
              <span key={i} className="concept-chip">{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* View Concept Map — full-page */}
      {data.concept_map && (
        <button className="map-btn glass-panel" onClick={onViewMap}>
          <Map size={16} /> View Concept Map
        </button>
      )}
    </div>
  );
};

export default DiagnosticReport;
