from typing import List, Dict, Any

class ConfidenceScorer:
    @staticmethod
    def score(documents: List[Dict[str, Any]]) -> str:
        if not documents:
            return "Low"
            
        if 'rerank_score' in documents[0]:
            top_score = documents[0]['rerank_score']
            if top_score > 3.0:
                return "High"
            elif top_score > 0.0:
                return "Medium"
            else:
                return "Low"
                
        if 'score' in documents[0] and documents[0]['score'] is not None:
            top_score = documents[0]['score']
            if top_score < 0.3:
                return "High"
            elif top_score < 0.7:
                return "Medium"
            else:
                return "Low"
                
        return "Unknown"
