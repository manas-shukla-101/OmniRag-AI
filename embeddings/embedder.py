from typing import List
import chromadb.utils.embedding_functions as embedding_functions

class Embedder:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        # This uses onnxruntime under the hood, which uses ~100MB RAM, 
        # easily fitting into Render's 512MB limit without PyTorch!
        self.ef = embedding_functions.DefaultEmbeddingFunction()

    def embed_documents(self, texts: List[str]):
        return self.ef(texts)

    def embed_query(self, text: str):
        return self.ef([text])[0]
