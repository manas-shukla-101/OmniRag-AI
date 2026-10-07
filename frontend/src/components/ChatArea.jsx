import React, { useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Cpu, 
  Zap, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  ShieldAlert 
} from 'lucide-react';
import ChatMessage from './ChatMessage';

const SUGGESTED_PROMPTS = [
  {
    icon: <Award size={15} />,
    title: "Who has the most IPL runs overall?",
    desc: "Queries player career statistics across seasons"
  },
  {
    icon: <TrendingUp size={15} />,
    title: "How many wickets has Jasprit Bumrah taken?",
    desc: "Retrieves specific bowler economy & strike metrics"
  },
  {
    icon: <Zap size={15} />,
    title: "Which team has won the most IPL championships?",
    desc: "Searches tournament titles and franchise history"
  },
  {
    icon: <HelpCircle size={15} />,
    title: "Compare Rashid Khan and Bumrah's bowling stats",
    desc: "Runs multi-chunk semantic synthesis"
  }
];

export default function ChatArea({
  messages,
  input,
  setInput,
  isLoading,
  onSendMessage,
  onClearChat,
  useExpansion,
  setUseExpansion,
  stats
}) {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSendMessage(input.trim());
      }
    }
  };

  const handlePromptClick = (text) => {
    onSendMessage(text);
  };

  return (
    <main className="main-chat-area">
      {/* ── Top Bar ── */}
      <header className="chat-topbar">
        <div className="topbar-info">
          <span className="topbar-title">OmniRAG Workspace</span>
          <span className="badge-pill">
            <Cpu size={12} />
            <span>Groq · LLaMA 3.3</span>
          </span>
          <span className="badge-pill" style={{ borderColor: 'rgba(6, 182, 212, 0.3)', color: '#67e8f9' }}>
            <span>BM25 + Semantic Hybrid</span>
          </span>
        </div>

        <div className="topbar-actions">
          {/* Query Expansion Toggle */}
          <div 
            className="toggle-wrapper" 
            onClick={() => setUseExpansion(!useExpansion)}
            title="Generate 3 varied rewrites to retrieve wider context"
          >
            <span>Query Expansion</span>
            <div className={`toggle-switch ${useExpansion ? 'active' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </div>

          {messages.length > 0 && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              onClick={onClearChat}
              title="Clear conversation history"
            >
              <Trash2 size={13} />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Message Flow ── */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div style={{
              margin: '0 auto 1.5rem',
              display: 'flex',
              justifyContent: 'center',
              animation: 'pulse-dot 4s infinite alternate'
            }}>
              <img src="/logo.png" alt="Logo" style={{ 
                width: "90px", 
                height: "90px", 
                objectFit: "cover", 
                borderRadius: "24px", 
                boxShadow: "0 0 40px rgba(255,255,255,0.05), 0 5px 30px rgba(99, 102, 241, 0.2)" 
              }} />
            </div>
            <h1 className="hero-title">Ask anything across your knowledge base</h1>
            <p className="hero-subtitle">
              OmniRAG uses hybrid BM25 + dense embeddings, neural cross-encoder reranking, and dynamic agentic routing for pinpoint accuracy.
            </p>

            {stats?.unique_sources?.some(s => s.toLowerCase().includes('ipl')) ? (
              <div className="prompt-chips">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="prompt-chip"
                    onClick={() => handlePromptClick(item.title)}
                  >
                    <div className="chip-icon">{item.icon}</div>
                    <div>
                      <div className="chip-text">{item.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: '3rem', textAlign: 'center', animation: 'slideUp 0.5s ease-out' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', letterSpacing: '0.02em' }}>Welcome to OmniRAG</h3>
                <p style={{ color: '#94a3b8', maxWidth: '550px', margin: '0 auto', lineHeight: '1.7', fontSize: '1rem' }}>
                  Upload your PDFs, CSVs, and code from the sidebar to start chatting with your custom knowledge base, or load the Instant Demo to see it in action.
                </p>
                <div style={{ 
                  marginTop: '2.5rem', 
                  padding: '1rem 2rem', 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', 
                  border: '1px solid rgba(139, 92, 246, 0.3)', 
                  borderRadius: '16px', 
                  display: 'inline-block',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}>
                  <p style={{ margin: 0, color: '#c7d2fe', fontSize: '1rem' }}>
                    Designed and Developed by <strong style={{ color: '#fff', fontWeight: '700' }}>Manas Shukla</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="avatar bot-avatar">
              <Zap size={18} />
            </div>
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Bottom Input Bar ── */}
      <div className="chat-input-bar">
        <div className="input-box-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask a question or explore retrieved insights... (Press Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button 
            className="send-btn" 
            onClick={() => input.trim() && onSendMessage(input.trim())}
            disabled={!input.trim() || isLoading}
            title="Send Message"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="input-hints">
          <span>⚡ Shift + Enter for new line · Enter to submit</span>
          <span>{stats.total_chunks} chunks ready for retrieval</span>
        </div>
      </div>
    </main>
  );
}
