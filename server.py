import os
import shutil
import tempfile
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from ingestors.pdf_loader import PDFLoader
from ingestors.csv_loader import CSVLoader
from ingestors.code_loader import CodeLoader
from ingestors.transcript_loader import TranscriptLoader
from chunking.fixed_chunker import FixedChunker
from chunking.semantic_chunker import SemanticChunker
from embeddings.embedder import Embedder
from vectorstore.chroma_store import ChromaStore
from retrieval.semantic_retriever import SemanticRetriever
from retrieval.bm25_retriever import BM25Retriever
from retrieval.hybrid_retriever import HybridRetriever
from retrieval.query_expander import QueryExpander
from retrieval.reranker import Reranker
from chains.qa_chain import QAChain
from chains.summarize_chain import SummarizeChain
from chains.router import Router
from memory.chat_history import ChatHistory
from utils.confidence import ConfidenceScorer
import config

app = FastAPI(title="OmniRAG API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

print("[INFO] Initializing OmniRAG components...")
embedder = Embedder()
vectorstore = ChromaStore(collection_name="omnirag_prod")
semantic_retriever = SemanticRetriever(vectorstore, embedder)
bm25_retriever = BM25Retriever()
hybrid_retriever = HybridRetriever(semantic_retriever, bm25_retriever)
reranker = Reranker()
qa_chain = QAChain()
summarize_chain = SummarizeChain()
query_expander = QueryExpander()
router = Router()
memory = ChatHistory()
print("[INFO] OmniRAG ready!")

try:
    existing = vectorstore.collection.get()
    if existing and existing.get("documents"):
        existing_chunks = []
        for doc, meta in zip(existing["documents"], existing.get("metadatas", [])):
            existing_chunks.append({"page_content": doc, "metadata": meta or {}})
        bm25_retriever.add_documents(existing_chunks)
        print(f"[INFO] Loaded {len(existing_chunks)} existing chunks into BM25 retriever.")
except Exception as e:
    print(f"[WARN] BM25 warm-up note: {e}")

class ChatRequest(BaseModel):
    message: str
    use_query_expansion: Optional[bool] = False
    top_k: Optional[int] = 5
    top_n_rerank: Optional[int] = 3


class ConfigRequest(BaseModel):
    groq_key: str = ""
    hf_token: str = ""

@app.post("/api/config")
def update_config(req: ConfigRequest):
    if req.groq_key:
        os.environ["GROQ_API_KEY"] = req.groq_key
        config.GROQ_API_KEY = req.groq_key
    if req.hf_token:
        os.environ["HF_TOKEN"] = req.hf_token
        config.HF_TOKEN = req.hf_token
        
    with open(".env", "w", encoding="utf-8") as f:
        f.write(f"GROQ_API_KEY={os.environ.get('GROQ_API_KEY', '')}\n")
        f.write(f"HF_TOKEN={os.environ.get('HF_TOKEN', '')}\n")
        
    return {"success": True}

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "model": config.GROQ_MODEL,
        "embedding_model": config.EMBEDDING_MODEL,
        "chroma_dir": config.CHROMA_PERSIST_DIRECTORY
    }

@app.get("/api/stats")
def get_stats():
    try:
        count = vectorstore.collection.count()
        docs = vectorstore.collection.get(limit=100)
        sources = set()
        if docs and docs.get("metadatas"):
            for m in docs["metadatas"]:
                if m and "source" in m:
                    sources.add(os.path.basename(m["source"]))
        return {
            "total_chunks": count,
            "unique_sources": sorted(list(sources)),
            "model": config.GROQ_MODEL,
            "reranker": "ms-marco-MiniLM-L-6-v2"
        }
    except Exception as e:
        return {"total_chunks": 0, "unique_sources": [], "error": str(e)}

@app.post("/api/load-demo")
def load_demo():
    try:
        import json
        all_docs = []
        if os.path.exists("demo_data/ipl_players.csv"):
            csv_loader = CSVLoader()
            all_docs.extend(csv_loader.load("demo_data/ipl_players.csv"))

        if os.path.exists("demo_data/ipl_stats.json"):
            with open("demo_data/ipl_stats.json", "r", encoding="utf-8") as f:
                data = json.load(f)
                all_docs.append({"page_content": str(data), "metadata": {"source": "ipl_stats.json"}})

        if not all_docs:
            raise HTTPException(status_code=404, detail="Demo files not found in demo_data/")

        chunker = FixedChunker(chunk_size=100, chunk_overlap=20)
        chunks = chunker.split(all_docs)
        embeddings = embedder.embed_documents([c["page_content"] for c in chunks])
        vectorstore.upsert(chunks, embeddings)
        bm25_retriever.add_documents(chunks)

        return {
            "success": True,
            "message": f"IPL cricket demo loaded successfully ({len(chunks)} chunks indexed).",
            "chunks_count": len(chunks),
            "sources": ["ipl_players.csv", "ipl_stats.json"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    temp_dir = tempfile.mkdtemp()
    try:
        all_docs = []
        uploaded_names = []
        for file in files:
            file_path = os.path.join(temp_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            uploaded_names.append(file.filename)
            ext = os.path.splitext(file.filename)[1].lower()

            if ext == ".pdf":
                loader = PDFLoader()
            elif ext == ".csv":
                loader = CSVLoader()
            elif ext in [".py", ".js", ".ts", ".html", ".css", ".java", ".cpp", ".json"]:
                loader = CodeLoader()
            else:
                loader = TranscriptLoader()

            docs = loader.load(file_path)
            for d in docs:
                d["metadata"]["source"] = file.filename
            all_docs.extend(docs)

        if not all_docs:
            raise HTTPException(status_code=400, detail="Could not extract any content from uploaded files.")

        chunker = SemanticChunker()
        chunks = chunker.split(all_docs)
        embeddings = embedder.embed_documents([c["page_content"] for c in chunks])
        vectorstore.upsert(chunks, embeddings)
        bm25_retriever.add_documents(chunks)

        return {
            "success": True,
            "message": f"Successfully indexed {len(files)} file(s) into {len(chunks)} semantic chunks.",
            "files": uploaded_names,
            "chunks_count": len(chunks),
            "total_chunks": vectorstore.collection.count()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

@app.post("/api/chat")
def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty query provided.")

    query = req.message.strip()
    try:
        source_type = router.route_query(query)

        expanded_queries = []
        if req.use_query_expansion:
            try:
                expanded_queries = query_expander.expand(query)
            except Exception as e:
                print(f"Query expansion fallback: {e}")
                expanded_queries = [query]

        if expanded_queries and len(expanded_queries) > 1:
            all_retrieved = []
            seen = set()
            for q in expanded_queries:
                docs = hybrid_retriever.retrieve(q, top_k=req.top_k)
                for d in docs:
                    txt = d["page_content"]
                    if txt not in seen:
                        seen.add(txt)
                        all_retrieved.append(d)
            retrieved_docs = all_retrieved[:req.top_k * 2]
        else:
            retrieved_docs = hybrid_retriever.retrieve(query, top_k=req.top_k)

        reranked_docs = reranker.rerank(query, retrieved_docs, top_k=req.top_n_rerank)
        confidence = ConfidenceScorer.score(reranked_docs)
        answer = qa_chain.generate_answer(query, reranked_docs)

        memory.add_message("user", query)
        memory.add_message("assistant", answer)

        formatted_sources = []
        for i, doc in enumerate(reranked_docs):
            raw_src = doc.get("metadata", {}).get("source", "Unknown")
            src_name = os.path.basename(raw_src)
            formatted_sources.append({
                "rank": i + 1,
                "source": src_name,
                "content": doc.get("page_content", ""),
                "rerank_score": round(float(doc.get("rerank_score", 0.0)), 4) if "rerank_score" in doc else None,
                "metadata": doc.get("metadata", {})
            })

        return {
            "answer": answer,
            "confidence": confidence,
            "route": source_type,
            "expanded_queries": expanded_queries,
            "sources": formatted_sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
def summarize():
    try:
        results = vectorstore.collection.get(limit=15)
        chunks = []
        if results and results.get("documents"):
            for doc in results["documents"]:
                chunks.append({"page_content": doc})
        if not chunks:
            return {
                "summary": "⚠️ No documents found in the knowledge base. Please upload documents or load the demo dataset first.",
                "chunks_analyzed": 0
            }
        summary = summarize_chain.summarize(chunks)
        return {
            "summary": summary,
            "chunks_analyzed": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clear")
def clear_knowledge_base():
    global vectorstore, bm25_retriever, memory
    try:
        try:
            vectorstore.client.delete_collection("omnirag_prod")
        except Exception:
            pass
        vectorstore = ChromaStore(collection_name="omnirag_prod")
        bm25_retriever = BM25Retriever()
        memory = ChatHistory()
        semantic_retriever.vectorstore = vectorstore
        hybrid_retriever.semantic_retriever = semantic_retriever
        hybrid_retriever.bm25_retriever = bm25_retriever
        return {"success": True, "message": "Knowledge base and memory successfully cleared."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
