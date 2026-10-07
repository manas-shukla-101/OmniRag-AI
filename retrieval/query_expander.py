from groq import Groq
import config
from typing import List

class QueryExpander:
    def __init__(self, model_name: str = config.GROQ_MODEL):
        api_key = config.GROQ_API_KEY
        if api_key:
            self.client = Groq(api_key=api_key)
        else:
            self.client = None
        self.model_name = model_name

    def expand(self, query: str) -> List[str]:
        if not self.client:
            return [query]
        prompt = f'''You are an AI that expands search queries for a retrieval system.
Given the original query, generate 3 varied rewrites of it that would help retrieve relevant documents.
Just output the 3 queries, one per line, without any numbering or extra text.

Original Query: {query}'''

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model_name,
                temperature=0.7,
            )
            text = response.choices[0].message.content.strip()
            queries = [q.strip("- ") for q in text.split("\n") if q.strip()]
            return [query] + queries[:3]
        except:
            return [query]
