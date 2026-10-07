class SemanticRetriever:
    def __init__(self, vectorstore, embedder):
        self.vectorstore = vectorstore
        self.embedder = embedder

    def retrieve(self, query: str, top_k: int = 5):
        query_embedding = self.embedder.embed_query(query)
        results = self.vectorstore.query(query_embedding, n_results=top_k)
        
        docs = []
        if results and results.get("documents"):
            for idx in range(len(results["documents"][0])):
                docs.append({
                    "page_content": results["documents"][0][idx],
                    "metadata": results["metadatas"][0][idx],
                    "score": results["distances"][0][idx] if "distances" in results else None
                })
        return docs
