class HybridRetriever:
    def __init__(self, semantic_retriever, bm25_retriever):
        self.semantic = semantic_retriever
        self.bm25 = bm25_retriever

    def retrieve(self, query: str, top_k: int = 5):
        sem_docs = self.semantic.retrieve(query, top_k=top_k)
        bm25_docs = self.bm25.retrieve(query, top_k=top_k)
        
        # Simple deduplication based on content
        seen = set()
        hybrid_docs = []
        for d in sem_docs + bm25_docs:
            txt = d["page_content"]
            if txt not in seen:
                seen.add(txt)
                hybrid_docs.append(d)
                
        return hybrid_docs[:top_k]
