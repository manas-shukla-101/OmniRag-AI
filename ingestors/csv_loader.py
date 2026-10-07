import csv

class CSVLoader:
    def load(self, file_path: str):
        docs = []
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                content = " | ".join(f"{k}: {v}" for k, v in row.items())
                docs.append({
                    "page_content": content,
                    "metadata": {"source": file_path}
                })
        return docs
