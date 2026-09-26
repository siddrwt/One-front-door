from typing import Dict, Any, List, Optional
import asyncio

class BaseAgent:
    def __init__(self, domain: str, retriever=None):
        self.domain = domain
        self.retriever = retriever
        
    async def handle(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Default handle implementation.
        Retrieves docs and returns a structured response.
        """
        # Mock retrieval delay
        await asyncio.sleep(0.5)
        
        docs = []
        if self.retriever:
            docs = self.retriever.retrieve(query=query, domain=self.domain)
            
        await asyncio.sleep(0.5) # Mock LLM generation
        
        sources = [{"title": d.get("title"), "source": d.get("source")} for d in docs]
        
        actions = []
        if self.domain == "Fees & Finance" or self.domain == "Finance":
            actions.append({"label": "View Fee Details", "action": "view_finance", "route": "/finance"})
        elif self.domain == "Career Services" or self.domain == "Career":
            actions.append({"label": "View Placements", "action": "view_placements", "route": "/career"})
        elif self.domain == "Student Life":
            actions.append({"label": "View Club", "action": "view_club", "route": "/clubs"})
            actions.append({"label": "Apply Now", "action": "apply_club", "route": "/clubs/apply"})
            
        return {
            "domain": self.domain,
            "response": f"Response from {self.domain} agent based on {len(docs)} sources.",
            "sources": sources,
            "actions": actions
        }
