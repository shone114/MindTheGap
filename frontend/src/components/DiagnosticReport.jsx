import React from 'react';
import { Target, AlertTriangle, AlertCircle, Crosshair } from 'lucide-react';
import './DiagnosticReport.css';

const DiagnosticReport = ({ data }) => {
  return (
    <div className="report-wrapper scrollable">
      <div className="report-header">
        <h2 className="title text-gradient">Session Diagnosis</h2>
        <p className="subtitle">Here is a brutal, honest breakdown of your understanding.</p>
      </div>

      <div className="score-section glass-panel">
        <div className="score-circle">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${data.mastery_score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="score-value">
            {data.mastery_score}
            <span className="score-label">Mastery</span>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="grid-card glass-panel">
          <h3 className="card-title">
            <AlertTriangle size={20} className="icon-warn" /> Weak Concepts
          </h3>
          <ul className="weak-list">
            {data.weak_concepts.map((concept, idx) => (
              <li key={idx}>
                <AlertCircle size={16} /> {concept}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid-card glass-panel">
          <h3 className="card-title">
            <Crosshair size={20} className="icon-danger" /> Breakpoints
          </h3>
          <ol className="breakpoint-list">
            {data.breakpoints.map((bp, idx) => (
              <li key={idx}>{bp}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="concept-map-section glass-panel">
        <h3 className="card-title">
          <Target size={20} className="icon-info" /> Concept Map
        </h3>
        <div className="chips-container">
          {data.concept_map.map((item, idx) => (
            <div key={idx} className={`concept-chip ${item.strength}`}>
              {item.concept}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReport;
