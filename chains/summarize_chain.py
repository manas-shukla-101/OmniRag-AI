from groq import Groq
import config
from typing import List, Dict, Any

class SummarizeChain:
    def __init__(self, model_name: str = config.GROQ_MODEL):
        self.client = Groq(api_key=config.GROQ_API_KEY) if config.GROQ_API_KEY else None
        self.model_name = model_name

    def summarize(self, chunks: List[Dict[str, Any]]) -> str:
        if not self.client:
            return "Groq API key not set."
            
        context = ""
        for doc in chunks:
            context += f"{doc['page_content']}\n\n"
            
        prompt = f'''You are an expert summarizer. Synthesize the following text into a comprehensive executive summary.

Text:
{context}

Summary:'''

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model_name,
            temperature=0.3,
        )

        return response.choices[0].message.content
