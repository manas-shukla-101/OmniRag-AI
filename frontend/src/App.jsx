import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SummaryModal from './components/SummaryModal';
import HomePage from './components/HomePage';
import { AlertTriangle, Info } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useExpansion, setUseExpansion] = useState(false);

  const [stats, setStats] = useState({ total_chunks: 0, unique_sources: [], model: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [summaryChunksCount, setSummaryChunksCount] = useState(0);
  const [chatCount, setChatCount] = useState(() => parseInt(localStorage.getItem('chat_count') || '0'));
  const hasCustomKeys = localStorage.getItem('has_custom_keys') === 'true';
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type = 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 4500);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Could not fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    if (!hasCustomKeys && chatCount >= 3) {
      showToast("You have exhausted your 3 free chat trials. Please provide your own API keys on the Home Page to continue.", "error");
      return;
    }

    const userMessage = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, use_query_expansion: useExpansion, top_k: 5, top_n_rerank: 3 }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to retrieve response from server.');
      }

      const data = await res.json();
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        confidence: data.confidence,
        route: data.route,
        sources: data.sources || [],
        expanded_queries: data.expanded_queries || [],
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      if (!hasCustomKeys) {
        const newCount = chatCount + 1;
        setChatCount(newCount);
        localStorage.setItem('chat_count', newCount.toString());
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `?? **Error:** ${err.message}`,
        confidence: 'Low',
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (fileList) => {
    if (!hasCustomKeys) {
      showToast("Uploads are restricted. Please provide your own API keys on the Home Page to upload custom documents.", "error");
      return;
    }
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);
    setUploadStatus('');
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) formData.append('files', fileList[i]);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('File ingestion failed.');
      const data = await res.json();
      setUploadStatus(`Indexed ${data.chunks_count} chunks!`);
      fetchStats();
      setTimeout(() => setUploadStatus(''), 5000);
    } catch (err) {
      showToast(`Upload error: ${err.message}`, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/load-demo', { method: 'POST' });
      if (!res.ok) throw new Error('Demo failed.');
      const data = await res.json();
      setUploadStatus(`Demo loaded: ${data.chunks_count} chunks!`);
      fetchStats();
      setTimeout(() => setUploadStatus(''), 5000);
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/summarize', { method: 'POST' });
      if (!res.ok) throw new Error('Summarization failed.');
      const data = await res.json();
      setSummaryText(data.summary);
      setSummaryChunksCount(data.chunks_analyzed);
      setSummaryModalOpen(true);
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('Clear knowledge base?')) return;
    try {
      const res = await fetch('/api/clear', { method: 'POST' });
      if (res.ok) {
        setMessages([]);
        fetchStats();
        setUploadStatus('Reset.');
        setTimeout(() => setUploadStatus(''), 3000);
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    }
  };

  return (
    <div className="app-container">
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {currentView === 'home' ? (
        <HomePage onLaunch={() => setCurrentView('chat')} />
      ) : (
        <>
          <Sidebar
            stats={stats}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            onUpload={handleUpload}
            isDemoLoading={isDemoLoading}
            onLoadDemo={handleLoadDemo}
            isSummarizing={isSummarizing}
            onSummarize={handleSummarize}
            onClearDatabase={handleClearDatabase}
            onGoHome={() => setCurrentView('home')}
          />
          <ChatArea
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearChat={() => setMessages([])}
            useExpansion={useExpansion}
            setUseExpansion={setUseExpansion}
            stats={stats}
          />
        </>
      )}

      <SummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        summary={summaryText}
        chunksAnalyzed={summaryChunksCount}
      />
      
      {toast.visible && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.85)' : 'rgba(99, 102, 241, 0.85)',
          color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)',
          fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={20} /> : <Info size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
