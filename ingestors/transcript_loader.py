class TranscriptLoader:
    def load(self, file_path: str):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return [{"page_content": content, "metadata": {"source": file_path}}]
