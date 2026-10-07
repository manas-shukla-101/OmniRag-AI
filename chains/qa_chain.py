from groq import Groq
import config
from typing import List, Dict, Any

class QAChain:
    def __init__(self, model_name: str = config.GROQ_MODEL):
        self.client = Groq(api_key=config.GROQ_API_KEY) if config.GROQ_API_KEY else None
        self.model_name = model_name

    def generate_answer(self, query: str, retrieved_docs: List[Dict[str, Any]]) -> str:
        if not self.client:
            return "Groq API key not set."
            
        context = ""
        for i, doc in enumerate(retrieved_docs):
            context += f"Source {i+1} ({doc['metadata'].get('source', 'Unknown')}):\n{doc['page_content']}\n\n"
            
        prompt = f'''You are a helpful assistant. Answer the user's query based ONLY on the provided context. If the answer is not in the context, say "I cannot answer this based on the provided documents."

Context:
{context}

Query: {query}
Answer:'''

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model_name,
            temperature=0.0,
        )

        return response.choices[0].message.content
