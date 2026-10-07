class FixedChunker:
    def __init__(self, chunk_size=500, chunk_overlap=50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split(self, documents):
        chunks = []
        for doc in documents:
            text = doc["page_content"]
            meta = doc["metadata"]
            start = 0
            while start < len(text):
                chunk_text = text[start:start+self.chunk_size]
                chunks.append({"page_content": chunk_text, "metadata": meta.copy()})
                start += self.chunk_size - self.chunk_overlap
        return chunks
