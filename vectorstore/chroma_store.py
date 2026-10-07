import chromadb
import uuid
from typing import List, Dict, Any
import config

class ChromaStore:
    def __init__(self, collection_name: str = "omnirag", persist_directory: str = config.CHROMA_PERSIST_DIRECTORY):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def upsert(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        if not chunks:
            return
            
        ids = [str(uuid.uuid4()) for _ in chunks]
        documents = [chunk['page_content'] for chunk in chunks]
        metadatas = [chunk['metadata'] for chunk in chunks]

        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def query(self, query_embedding: List[float], n_results: int = 5):
        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
