import os
import time
import requests
from typing import List
import config

class Embedder:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"

    def _query(self, payload, retries=5):
        token = os.environ.get("HF_TOKEN")
        if not token:
            raise ValueError("HF_TOKEN is missing! Please open the API Configuration panel on the Home Page and save your Hugging Face Token.")
        headers = {"Authorization": f"Bearer {token}"}
        
        for i in range(retries):
            response = requests.post(self.api_url, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and "error" in data:
                    if "loading" in data.get("error", "").lower():
                        time.sleep(5)
                        continue
                    raise ValueError(f"Hugging Face API Error: {data['error']}")
                return data
            elif response.status_code == 503:
                # Model is loading
                time.sleep(5)
            else:
                raise ValueError(f"Hugging Face API Error ({response.status_code}): {response.text}")
                
        raise ValueError("Hugging Face API Error: Model failed to load or respond in time.")

    def embed_documents(self, texts: List[str]):
        # Hugging Face Free API strictly limits batch sizes. 
        # We must batch the requests into small chunks (e.g., 20)
        batch_size = 20
        all_embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            res = self._query({"inputs": batch})
            
            # The API returns a 1D list if a single string is passed, 
            # and a 2D list if a list of strings is passed.
            if isinstance(res, list):
                if len(res) > 0 and not isinstance(res[0], list):
                    # It returned a 1D list, which shouldn't happen for a batch, but just in case
                    all_embeddings.append(res)
                else:
                    all_embeddings.extend(res)
            else:
                raise ValueError(f"Unexpected response format from HF API: {res}")
                
        return all_embeddings

    def embed_query(self, text: str):
        res = self._query({"inputs": text})
        # If the API returns a 2D list for a single string
        if isinstance(res, list) and len(res) > 0 and isinstance(res[0], list):
            return res[0]
        return res
