import React from 'react';
import { Sparkles, Database, Zap, ArrowRight, ShieldCheck, Search, Key } from 'lucide-react';
import { useState } from 'react';

export default function HomePage({ onLaunch }) {
  const [groqKey, setGroqKey] = useState('');
  const [hfToken, setHfToken] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleLaunch = async () => {
    if (groqKey.trim() || hfToken.trim()) {
      try {
        await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ groq_key: groqKey.trim(), hf_token: hfToken.trim() })
        });
        localStorage.setItem('has_custom_keys', 'true');
      } catch (err) {
        console.error(err);
      }
    }
    onLaunch();
  };
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      overflowY: 'auto'
    }}>

      <div style={{
        marginBottom: '2rem',
        animation: 'slideUp 0.6s ease-out'
      }}>
        <div style={{
          margin: '0 auto 2.5rem',
          display: 'flex',
          justifyContent: 'center',
          animation: 'pulse-dot 4s infinite alternate'
        }}>
          <img src="/logo.png" alt="OmniRAG Logo" style={{
            width: "140px",
            height: "140px",
            objectFit: "cover",
            borderRadius: "32px",
            boxShadow: "0 0 60px rgba(255,255,255,0.05), 0 10px 40px rgba(99, 102, 241, 0.25)"
          }} />
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          letterSpacing: '-0.04em',
          background: 'var(--gradient-brand)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          OmniRAG Enterprise
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '650px',
          lineHeight: '1.6',
          margin: '0 auto'
        }}>
          Next-generation Retrieval-Augmented Generation.
          Seamlessly ingest PDFs, CSVs, and Code with hybrid BM25 and Semantic dense retrieval, powered by LLaMA 3.3.
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '3rem',
        animation: 'slideUp 0.8s ease-out',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <FeatureCard
          icon={<Database size={24} />}
          title="Multi-Source Data"
          desc="Drop in any file and it's instantly chunked, embedded, and indexed."
        />
        <FeatureCard
          icon={<Search size={24} />}
          title="Hybrid Search"
          desc="BM25 keyword matching + Dense Semantic vector search."
        />
        <FeatureCard
          icon={<ShieldCheck size={24} />}
          title="Neural Reranking"
          desc="Cross-encoder validation for ultra-high accuracy and confidence."
        />
      </div>

      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto 2.5rem', animation: 'slideUp 0.9s ease-out' }}>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto',
            padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Key size={16} color={showConfig ? "#8b5cf6" : "#64748b"} />
          {showConfig ? "Hide API Configuration" : "Provide Custom API Keys (Recommended)"}
        </button>

        {showConfig && (
          <div className="glass-panel" style={{
            marginTop: '1rem', padding: '1.5rem', display: 'flex', gap: '1.25rem', flexDirection: 'column',
            background: 'rgba(20, 24, 39, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#fbbf24', textAlign: 'center', margin: '0 0 0.5rem', background: 'rgba(251, 191, 36, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              Highly recommended to use your own keys to prevent rate limits.⚠️
            </p>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>Groq API Key</span>
              </div>
              <input
                type="password" placeholder="gsk_..." value={groqKey} onChange={(e) => setGroqKey(e.target.value)}
                style={{ width: '100%', background: 'rgba(10, 12, 18, 0.5)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: '0.9rem', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>Find your free key at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', textDecoration: 'none' }}>console.groq.com</a></p>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>HuggingFace Token</span>
              </div>
              <input
                type="password" placeholder="hf_..." value={hfToken} onChange={(e) => setHfToken(e.target.value)}
                style={{ width: '100%', background: 'rgba(10, 12, 18, 0.5)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '12px', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: '0.9rem', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>Find your free token at <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', textDecoration: 'none' }}>huggingface.co/settings</a></p>
            </div>
          </div>
        )}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleLaunch}
        style={{
          padding: '1rem 2.5rem',
          fontSize: '1.1rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
          animation: 'scaleUp 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span>Launch Workspace</span>
        <ArrowRight size={20} />
      </button>

    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel" style={{
      padding: '2rem 1.5rem',
      width: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '1rem',
      background: 'rgba(20, 24, 39, 0.45)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      cursor: 'default'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
        e.currentTarget.style.background = 'rgba(30, 35, 55, 0.7)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.background = 'rgba(20, 24, 39, 0.45)';
      }}
    >
      <div style={{
        color: '#ffffff',
        marginBottom: '0.25rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '18px',
        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', letterSpacing: '0.02em' }}>{title}</h3>
      <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: '1.65' }}>{desc}</p>
    </div>
  );
}
