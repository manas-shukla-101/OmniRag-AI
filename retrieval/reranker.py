from sentence_transformers import CrossEncoder
from typing import List, Dict, Any

class Reranker:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)

    def rerank(self, query: str, documents: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
        if not documents:
            return []
            
        pairs = [[query, doc['page_content']] for doc in documents]
        scores = self.model.predict(pairs)
        
        for idx, doc in enumerate(documents):
            doc['rerank_score'] = float(scores[idx])
            
        reranked_docs = sorted(documents, key=lambda x: x['rerank_score'], reverse=True)
        return reranked_docs[:top_k]
