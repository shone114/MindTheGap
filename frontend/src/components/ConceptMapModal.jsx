import React from 'react';
import './ConceptMapModal.css';

// Simple radial SVG mind map — no external library needed
const ConceptMapModal = ({ conceptMap, onClose }) => {
  const { root, nodes = [], edges = [] } = conceptMap;

  // Layout: root at center, children in a circle
  const cx = 300;
  const cy = 260;
  const radius = 170;
  const angleStep = (2 * Math.PI) / Math.max(nodes.length, 1);

  // Build position map
  const positions = { [root]: { x: cx, y: cy } };
  nodes.forEach((node, i) => {
    const angle = i * angleStep - Math.PI / 2;
    positions[node.id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const strengthColor = {
    strong: '#588157',
    weak: '#A94442',
    partial: '#c07a2e',
  };

  const strengthBg = {
    strong: 'rgba(88,129,87,0.15)',
    weak: 'rgba(169,68,66,0.15)',
    partial: 'rgba(192,122,46,0.15)',
  };

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="map-modal-header">
          <h3>{root} — Concept Map</h3>
          <button className="map-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="map-legend">
          <span className="legend-dot" style={{ background: strengthColor.strong }} /> Strong
          <span className="legend-dot" style={{ background: strengthColor.partial }} /> Partial
          <span className="legend-dot" style={{ background: strengthColor.weak }} /> Weak
        </div>

        <svg
          viewBox="0 0 600 520"
          className="map-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Edges */}
          {edges.map((e, i) => {
            const from = positions[e.source] || positions[root];
            const to = positions[e.target];
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            );
          })}

          {/* Root node */}
          <g>
            <circle cx={cx} cy={cy} r={44} fill="rgba(25,44,35,0.9)" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize="11" fontWeight="700" fontFamily="Outfit, sans-serif">
              {root.length > 14 ? root.slice(0, 13) + '…' : root}
            </text>
          </g>

          {/* Sub-concept nodes */}
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;
            const color = strengthColor[node.strength] || '#888';
            const bg = strengthBg[node.strength] || 'rgba(0,0,0,0.1)';
            const labelLines = node.label.length > 12
              ? [node.label.slice(0, 12), node.label.slice(12)]
              : [node.label];
            return (
              <g key={node.id}>
                <circle cx={pos.x} cy={pos.y} r={38}
                  fill={bg} stroke={color} strokeWidth="2" />
                {labelLines.map((line, li) => (
                  <text key={li} x={pos.x} y={pos.y + (li - (labelLines.length - 1) / 2) * 13}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={color} fontSize="10" fontWeight="600" fontFamily="Outfit, sans-serif">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ConceptMapModal;
