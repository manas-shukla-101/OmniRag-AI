import os
import requests
from typing import List, Dict, Any

class Reranker:
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/models/{model_name}"

    def rerank(self, query: str, documents: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
        if not documents:
            return []
            
        token = os.environ.get("HF_TOKEN")
        if not token:
            # If no token, just return the documents without reranking
            return documents[:top_k]
            
        headers = {"Authorization": f"Bearer {token}"}
        
        # We will score each pair sequentially (or just rely on the fallback if HF fails)
        try:
            for doc in documents:
                payload = {"inputs": {"text": query, "text_pair": doc['page_content']}}
                res = requests.post(self.api_url, headers=headers, json=payload).json()
                if isinstance(res, list) and len(res) > 0 and 'score' in res[0]:
                    doc['rerank_score'] = res[0]['score']
                else:
                    doc['rerank_score'] = 0.0
        except Exception:
            # Fallback to no-op if the API limits out
            pass
            
        reranked_docs = sorted(documents, key=lambda x: x.get('rerank_score', 0), reverse=True)
        return reranked_docs[:top_k]
