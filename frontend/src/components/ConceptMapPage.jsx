import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { colors } from '../theme/colors';
import './ConceptMapPage.css';

// Build adjacency list from edges + derive tree levels via BFS
function buildTree(root, nodes, edges) {
  // Map node id → node info
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // Build children map (id or root string → [child ids])
  const children = {};
  edges.forEach(({ source, target }) => {
    if (!children[source]) children[source] = [];
    children[source].push(target);
  });

  // BFS to get levels
  const levels = [];    // levels[depth] = [nodeId, ...]
  const visited = new Set();
  let queue = [root];
  visited.add(root);

  while (queue.length) {
    levels.push([...queue]);
    const next = [];
    queue.forEach(id => {
      (children[id] || []).forEach(cid => {
        if (!visited.has(cid)) {
          visited.add(cid);
          next.push(cid);
        }
      });
    });
    queue = next;
  }

  // Any orphan nodes not reachable from root go in last level
  const orphans = nodes.filter(n => !visited.has(n.id)).map(n => n.id);
  if (orphans.length) levels.push(orphans);

  return { levels, nodeMap, children };
}

// Assign (x, y) to each node ID in SVG coordinate space
function computePositions(levels, W, H) {
  const pos = {};
  const vGap = H / (levels.length + 1);   // vertical spacing per level

  levels.forEach((level, depth) => {
    const y = (depth + 1) * vGap;
    const hGap = W / (level.length + 1);
    level.forEach((id, i) => {
      pos[id] = { x: (i + 1) * hGap, y };
    });
  });

  return pos;
}

const nodeColors = {
  strong:  { stroke: '#5aabe0', bg: 'rgba(162,210,255,0.45)', text: '#1a4d7a' },
  weak:    { stroke: '#d46090', bg: 'rgba(255,200,221,0.55)', text: '#7a1f42' },
  partial: { stroke: '#9b7ccc', bg: 'rgba(205,180,219,0.45)', text: '#4a2878' },
};

const ROOT_STYLE = { fill: colors.accent, stroke: colors.highlight, text: colors.textPrimary };

const splitLabel = (label, maxChars = 11) => {
  const words = label.split(' ');
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  });
  if (cur) lines.push(cur.trim());
  return lines.slice(0, 3); // max 3 lines
};

const ConceptMapPage = ({ conceptMap, onBack }) => {
  const { root, nodes = [], edges = [] } = conceptMap;

  const W = 600, H = 480;
  const { levels, nodeMap } = buildTree(root, nodes, edges);
  const pos = computePositions(levels, W, H);

  // Collect all edge pairs as positions for drawing
  const edgeLines = edges.map(({ source, target }) => {
    const from = pos[source] || pos[root];
    const to = pos[target];
    return { from, to };
  }).filter(e => e.from && e.to);

  const rootPos = pos[root] || { x: W / 2, y: H / (levels.length + 1) };
  const rootLines = splitLabel(root, 14);

  return (
    <div className="map-page animate-slide-up">
      <div className="map-page-header">
        <button className="map-back-btn glass-panel" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="map-page-title">{root}</h2>
      </div>

      <div className="map-legend">
        {[
          { label: 'Strong', color: '#5aabe0' },
          { label: 'Partial', color: '#9b7ccc' },
          { label: 'Weak',   color: '#d46090' },
        ].map(({ label, color }) => (
          <span key={label} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      <div className="map-svg-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="map-svg" xmlns="http://www.w3.org/2000/svg">

          {/* Edges */}
          {edgeLines.map((e, i) => (
            <line key={i}
              x1={e.from.x} y1={e.from.y}
              x2={e.to.x}   y2={e.to.y}
              stroke="rgba(109,79,130,0.25)"
              strokeWidth="1.8"
            />
          ))}

          {/* Sub-nodes */}
          {nodes.map((node) => {
            const p = pos[node.id];
            if (!p) return null;
            const c = nodeColors[node.strength] || nodeColors.partial;
            const lines = splitLabel(node.label);
            const r = 36;
            return (
              <g key={node.id}>
                <circle cx={p.x} cy={p.y} r={r}
                  fill={c.bg} stroke={c.stroke} strokeWidth="2.5" />
                {lines.map((line, li) => (
                  <text key={li}
                    x={p.x}
                    y={p.y + (li - (lines.length - 1) / 2) * 13}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={c.text} fontSize="10" fontWeight="700"
                    fontFamily="Outfit, sans-serif">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Root node — drawn last so it's on top */}
          <circle cx={rootPos.x} cy={rootPos.y} r={46}
            fill={ROOT_STYLE.fill} stroke={ROOT_STYLE.stroke} strokeWidth="3" />
          {rootLines.map((line, li) => (
            <text key={li}
              x={rootPos.x}
              y={rootPos.y + (li - (rootLines.length - 1) / 2) * 15}
              textAnchor="middle" dominantBaseline="middle"
              fill={ROOT_STYLE.text} fontSize="12" fontWeight="800"
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
