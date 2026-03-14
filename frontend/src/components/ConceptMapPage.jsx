import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './ConceptMapPage.css';

// Radial SVG mind map — pure, no library
const ConceptMapPage = ({ conceptMap, onBack }) => {
  const { root, nodes = [], edges = [] } = conceptMap;

  const W = 600, H = 520;
  const cx = W / 2, cy = H / 2;
  const radius = 185;
  const angleStep = nodes.length > 0 ? (2 * Math.PI) / nodes.length : 0;

  // position map keyed by id (and root string)
  const pos = { [root]: { x: cx, y: cy } };
  nodes.forEach((node, i) => {
    const angle = i * angleStep - Math.PI / 2;
    pos[node.id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const colors = { strong: '#588157', weak: '#A94442', partial: '#c07a2e' };
  const bgColors = { strong: 'rgba(88,129,87,0.18)', weak: 'rgba(169,68,66,0.15)', partial: 'rgba(192,122,46,0.15)' };

  // Wrap text to two short lines
  const splitLabel = (label) => {
    if (label.length <= 10) return [label];
    const mid = label.lastIndexOf(' ', 10);
    return mid > 0
      ? [label.slice(0, mid), label.slice(mid + 1)]
      : [label.slice(0, 10), label.slice(10)];
  };

  return (
    <div className="map-page animate-slide-up">
      <div className="map-page-header">
        <button className="map-back-btn glass-panel" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="map-page-title">{root}</h2>
      </div>

      <div className="map-legend">
        {['strong', 'partial', 'weak'].map(s => (
          <span key={s} className="legend-item">
            <span className="legend-dot" style={{ background: colors[s] }} />
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        ))}
      </div>

      <div className="map-svg-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="map-svg" xmlns="http://www.w3.org/2000/svg">

          {/* Edges */}
          {edges.map((e, i) => {
            const from = pos[e.source] || pos[root];
            const to = pos[e.target];
            if (!from || !to) return null;
            return (
              <line key={i}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="rgba(25,44,35,0.15)" strokeWidth="1.5" strokeDasharray="5 4"
              />
            );
          })}

          {/* Sub-nodes */}
          {nodes.map((node) => {
            const p = pos[node.id];
            if (!p) return null;
            const c = colors[node.strength] || '#888';
            const bg = bgColors[node.strength] || 'rgba(0,0,0,0.08)';
            const lines = splitLabel(node.label);
            return (
              <g key={node.id}>
                <circle cx={p.x} cy={p.y} r={40} fill={bg} stroke={c} strokeWidth="2.5" />
                {lines.map((line, li) => (
                  <text key={li}
                    x={p.x}
                    y={p.y + (li - (lines.length - 1) / 2) * 14}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={c} fontSize="10.5" fontWeight="700"
                    fontFamily="Outfit, sans-serif">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Root node — on top */}
          <circle cx={cx} cy={cy} r={50} fill="rgba(25,44,35,0.88)" />
          {splitLabel(root).map((line, li, arr) => (
            <text key={li}
              x={cx}
              y={cy + (li - (arr.length - 1) / 2) * 15}
              textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize="12" fontWeight="800"
              fontFamily="Outfit, sans-serif">
              {line}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default ConceptMapPage;
