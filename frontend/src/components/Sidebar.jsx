import React, { useRef } from 'react';
import { 
  Zap, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Database, 
  Trash2, 
  Loader2, 
  FileCode, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export default function Sidebar({
  onGoHome,
  stats,
  isUploading,
  uploadStatus,
  onUpload,
  isDemoLoading,
  onLoadDemo,
  isSummarizing,
  onSummarize,
  onClearDatabase,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <aside className="sidebar">
      {/* ── Brand Header ── */}
      <div className="brand-header">
        <div className="brand-title" onClick={onGoHome} style={{cursor: "pointer"}} title="Return to Home">
          <div className="brand-icon">
            <img src="/logo.png" alt="OmniRAG Logo" style={{ width: "22px", height: "22px", objectFit: "contain", borderRadius: "4px" }} />
          </div>
          <span>OmniRAG</span>
        </div>
        <div className="live-badge" title="Backend connected">
          <span className="radar-dot"></span>
          <span>Online</span>
        </div>
      </div>

      {/* ── Ingestion Panel ── */}
      <div className="glass-panel sidebar-section">
        <div className="section-header">
          <span className="section-title">
            <UploadCloud size={16} />
            <span>Document Ingestion</span>
          </span>
        </div>
        <p className="section-desc">
          Upload multi-source files. PDFs, CSVs, source code, and transcripts are automatically chunked & indexed.
        </p>

        <div 
          className="dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept=".pdf,.csv,.txt,.py,.js,.ts,.html,.css,.java,.cpp,.srt,.json"
            style={{ display: 'none' }} 
          />
          {isUploading ? (
            <>
              <Loader2 size={28} className="dropzone-icon animate-spin" />
              <span className="dropzone-text">Chunking & embedding...</span>
            </>
          ) : (
            <>
              <UploadCloud size={28} className="dropzone-icon" />
              <span className="dropzone-text">Click or drag & drop files</span>
              <span className="dropzone-hint">PDF, CSV, Code (.py, .js), Transcripts</span>
            </>
          )}
        </div>

        {uploadStatus && (
          <div className="file-pill" style={{ marginTop: '0.4rem', color: '#86efac', borderColor: 'rgba(34,197,94,0.3)' }}>
            <CheckCircle2 size={12} />
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      {/* ── Instant Demo Dataset ── */}
      <div className="glass-panel sidebar-section">
        <div className="section-header">
          <span className="section-title">
            <Sparkles size={16} />
            <span>Instant Demo</span>
          </span>
        </div>
        <p className="section-desc">
          Explore immediately without uploading. Loads IPL cricket match stats & player profiles into ChromaDB.
        </p>
        <button 
          className="btn btn-special" 
          onClick={onLoadDemo} 
          disabled={isDemoLoading}
        >
          {isDemoLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Indexing IPL Data...</span>
            </>
          ) : (
            <>
              <span>🏏</span>
              <span>Load IPL Demo Dataset</span>
            </>
          )}
        </button>
      </div>

      {/* ── Summarization Tool ── */}
      <div className="glass-panel sidebar-section">
        <div className="section-header">
          <span className="section-title">
            <Layers size={16} />
            <span>Map-Reduce Summarizer</span>
          </span>
        </div>
        <p className="section-desc">
          Synthesizes a comprehensive briefing across all indexed documents in the active knowledge base.
        </p>
        <button 
          className="btn btn-secondary" 
          onClick={onSummarize} 
          disabled={isSummarizing || stats.total_chunks === 0}
        >
          {isSummarizing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Sparkles size={15} style={{ color: '#c084fc' }} />
              <span>Summarize Knowledge Base</span>
            </>
          )}
        </button>
      </div>

      {/* ── Knowledge Base Stats ── */}
      <div className="glass-panel sidebar-section" style={{ marginTop: 'auto' }}>
        <div className="section-header">
          <span className="section-title">
            <Database size={16} />
            <span>Vector Store</span>
          </span>
          {stats.total_chunks > 0 && (
            <button 
              className="btn btn-danger" 
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
              onClick={onClearDatabase}
              title="Clear all indexed documents"
            >
              <Trash2 size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Chunks</span>
            <span className="stat-value">{stats.total_chunks}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Sources</span>
            <span className="stat-value">{stats.unique_sources?.length || 0}</span>
          </div>
        </div>

        {stats.unique_sources && stats.unique_sources.length > 0 && (
          <div className="file-pills">
            {stats.unique_sources.slice(0, 5).map((src, idx) => (
              <span key={idx} className="file-pill" title={src}>
                <FileText size={10} />
                <span>{src.length > 18 ? src.slice(0, 16) + '…' : src}</span>
              </span>
            ))}
            {stats.unique_sources.length > 5 && (
              <span className="file-pill">+{stats.unique_sources.length - 5} more</span>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
