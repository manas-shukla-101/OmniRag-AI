from sentence_transformers import SentenceTransformer
import config

class Embedder:
    def __init__(self, model_name=config.EMBEDDING_MODEL):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return self.model.encode(texts).tolist()

    def embed_query(self, text):
        return self.model.encode([text]).tolist()[0]
