from rank_bm25 import BM25Okapi

class BM25Retriever:
    def __init__(self):
        self.documents = []
        self.bm25 = None

    def add_documents(self, chunks):
        self.documents.extend(chunks)
        tokenized_corpus = [doc['page_content'].split(" ") for doc in self.documents]
        self.bm25 = BM25Okapi(tokenized_corpus)

    def retrieve(self, query: str, top_k: int = 5):
        if not self.bm25 or not self.documents:
            return []
        tokenized_query = query.split(" ")
        scores = self.bm25.get_scores(tokenized_query)
        
        scored_docs = []
        for idx, score in enumerate(scores):
            doc = self.documents[idx].copy()
            doc["bm25_score"] = score
            scored_docs.append(doc)
            
        return sorted(scored_docs, key=lambda x: x["bm25_score"], reverse=True)[:top_k]
