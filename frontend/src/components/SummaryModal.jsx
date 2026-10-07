import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, BookOpen } from 'lucide-react';
import { marked } from 'marked';

export default function SummaryModal({ isOpen, onClose, summary, chunksAnalyzed }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const htmlContent = summary ? marked.parse(summary) : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sparkles size={18} style={{ color: '#c084fc' }} />
            <span>Knowledge Base Executive Summary</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={handleCopy}
            >
              {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {chunksAnalyzed > 0 && (
            <div style={{ 
              marginBottom: '1rem', 
              fontSize: '0.78rem', 
              color: '#94a3b8', 
              padding: '0.5rem 0.75rem', 
              background: 'rgba(99,102,241,0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(99,102,241,0.2)' 
            }}>
              🧠 Map-reduce synthesis executed across <strong>{chunksAnalyzed} knowledge chunks</strong>.
            </div>
          )}
          <div 
            className="markdown-body" 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </div>
    </div>
  );
}
