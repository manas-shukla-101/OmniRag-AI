import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { marked } from 'marked';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceClass = (conf) => {
    if (!conf) return '';
    const lower = conf.toLowerCase();
    if (lower === 'high') return 'confidence-high';
    if (lower === 'medium') return 'confidence-medium';
    return 'confidence-low';
  };

  const htmlContent = isUser ? null : marked.parse(message.content || '');

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'bot'}`}>
      <div className={`avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="message-bubble">
        <div className="message-content">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>

        {/* Metadata bar for assistant replies */}
        {!isUser && (
          <div className="meta-bar">
            {message.confidence && (
              <span className={`meta-chip ${getConfidenceClass(message.confidence)}`}>
                <ShieldCheck size={12} />
                <span>{message.confidence} Confidence</span>
              </span>
            )}

            {message.route && (
              <span className="meta-chip meta-route">
                <Compass size={12} />
                <span>{message.route.toUpperCase()} ROUTE</span>
              </span>
            )}

            {message.sources && message.sources.length > 0 && (
              <button 
                className="sources-toggle-btn"
                onClick={() => setShowSources(!showSources)}
              >
                <FileText size={12} />
                <span>{message.sources.length} Cited Chunks</span>
                {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}

            <button 
              className="sources-toggle-btn"
              onClick={handleCopy}
              title="Copy answer"
            >
              {copied ? <Check size={12} style={{ color: '#4ade80' }} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

        {/* Expandable Citations / Sources Drawer */}
        {!isUser && showSources && message.sources && message.sources.length > 0 && (
          <div className="sources-drawer">
            {message.sources.map((src, index) => (
              <div key={index} className="source-item">
                <div className="source-header">
                  <span className="source-badge">
                    [{src.rank}] {src.source}
                  </span>
                  {src.rerank_score !== null && (
                    <span className="source-score">
                      Rerank Score: {src.rerank_score}
                    </span>
                  )}
                </div>
                <div className="source-snippet">
                  {src.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
