import pymupdf

class PDFLoader:
    def load(self, file_path: str):
        docs = []
        doc = pymupdf.open(file_path)
        for i, page in enumerate(doc):
            text = page.get_text()
            if text.strip():
                docs.append({
                    "page_content": text,
                    "metadata": {"source": file_path, "page": i + 1}
                })
        return docs
