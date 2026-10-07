from groq import Groq
import config

class Router:
    def __init__(self, model_name: str = config.GROQ_MODEL):
        self.client = Groq(api_key=config.GROQ_API_KEY) if config.GROQ_API_KEY else None
        self.model_name = model_name

    def route_query(self, query: str) -> str:
        if not self.client:
            return 'all'
            
        prompt = f'''Given the following user query, decide which data source type is most appropriate to search.
Options: pdf, csv, web, code, transcript, all.
Reply with ONLY the option name, in lowercase.

Query: {query}
Source:'''

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model_name,
                temperature=0.0,
            )
            
            source = response.choices[0].message.content.strip().lower()
            valid_sources = ['pdf', 'csv', 'web', 'code', 'transcript', 'all']
            if source not in valid_sources:
                return 'all'
            return source
        except:
            return 'all'
