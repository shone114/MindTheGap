import React from 'react';
import { Download, X } from 'lucide-react';
import './InstallPrompt.css';

const InstallPrompt = ({ onInstall, onDismiss }) => (
  <div className="install-overlay" role="dialog" aria-modal="true">
    <div className="install-card glass-panel">
      <button className="install-close" onClick={onDismiss} aria-label="Dismiss">
        <X size={18} />
      </button>

      <div className="install-icon">🧠</div>

      <h3 className="install-title">Install MindTheGap</h3>
      <p className="install-desc">
        Add to your home screen for offline access, instant launch, and a native app feel.
      </p>

      <button className="install-btn" onClick={onInstall}>
        <Download size={16} /> Install App
      </button>

      <button className="install-skip" onClick={onDismiss}>
        Maybe later
      </button>
    </div>
  </div>
);

export default InstallPrompt;
