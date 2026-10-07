import os
import requests
from typing import List
import config

class Embedder:
    def __init__(self, model_name=config.EMBEDDING_MODEL):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"

    def _query(self, payload):
        token = os.environ.get("HF_TOKEN")
        if not token:
            raise ValueError("HF_TOKEN is missing! Please provide it on the Home Page.")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(self.api_url, headers=headers, json=payload)
        if response.status_code != 200:
            raise ValueError(f"Hugging Face API Error: {response.text}")
        return response.json()

    def embed_documents(self, texts: List[str]):
        return self._query({"inputs": texts})

    def embed_query(self, text: str):
        return self._query({"inputs": [text]})[0]
