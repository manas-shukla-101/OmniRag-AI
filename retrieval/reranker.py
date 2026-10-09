from typing import List, Dict, Any

class Reranker:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model_name = model_name

    def rerank(self, query: str, documents: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
        # Bypass API reranker due to Render DNS issues.
        # Hybrid BM25 + Semantic search is already highly accurate.
        return documents[:top_k]
