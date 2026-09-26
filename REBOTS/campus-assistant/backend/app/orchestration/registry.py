from typing import Dict, Optional
from app.agents.base import BaseAgent

class AgentRegistry:
    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
        
    def register(self, domain: str, agent: BaseAgent):
        self._agents[domain] = agent
        
    def get_agent(self, domain: str) -> Optional[BaseAgent]:
        return self._agents.get(domain)

registry = AgentRegistry()
