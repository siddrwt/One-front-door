from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import httpx
import asyncio
import json
from app.rag.retriever import CampusRetriever
from app.orchestration.registry import registry
from app.agents.base import BaseAgent

router = APIRouter()
retriever = CampusRetriever()

class ChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    response: str
    domain: str
    confidence: float
    sources: List[dict]
    needs_clarification: bool = False
    clarification_options: List[str] = []

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # 1. Call ML Service for classification
    try:
        async with httpx.AsyncClient() as client:
            ml_response = await client.post(
                "http://localhost:8001/classify",
                json={"text": request.query}
            )
            ml_response.raise_for_status()
            classification = ml_response.json()
    except Exception as e:
        # Fallback or error
        raise HTTPException(status_code=500, detail=f"ML Service error: {str(e)}")
        
    domain = classification.get("domain", "General")
    confidence = classification.get("confidence", 0.0)
    
    # 2. Confidence Engine
    if confidence < 0.65:
        return ChatResponse(
            response="I'm not completely sure which department can best answer this. Are you asking about:",
            domain="Unknown",
            confidence=confidence,
            sources=[],
            needs_clarification=True,
            clarification_options=[domain, "General"] # simplified
        )
    elif confidence < 0.85:
        # Medium confidence: might want to ask a light clarification, but we'll proceed for now
        pass
        
    # 3. RAG Retrieval
    docs = retriever.retrieve(query=request.query, domain=domain)
    
    # 4. (Mock) LLM Generation
    # In production, you would call OpenAI / Ollama here with the docs as context.
    context = "\n".join([d["text"] for d in docs])
    
    if not docs:
        final_answer = f"I am routing your question to the {domain} department, but I couldn't find specific documentation."
    else:
        final_answer = f"Based on the {domain} guidelines: " + docs[0]["text"]
        
    sources = [{"title": d.get("title"), "source": d.get("source")} for d in docs]
    
    return ChatResponse(
        response=final_answer,
        domain=domain,
        confidence=confidence,
        sources=sources
    )

# Initialize Agents (reuses the module-level retriever from line 13)
registry.register("Finance", BaseAgent("Finance", retriever))
registry.register("Career", BaseAgent("Career", retriever))
registry.register("Housing", BaseAgent("Housing", retriever))
registry.register("Student Life", BaseAgent("Student Life", retriever))
registry.register("Academics", BaseAgent("Academics", retriever))
registry.register("General", BaseAgent("General", retriever))

@router.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    async def event_generator():
        yield f"data: {json.dumps({'state': 'query_received'})}\n\n"
        await asyncio.sleep(0.3)
        
        yield f"data: {json.dumps({'state': 'classification_started'})}\n\n"
        
        domains = []
        confidences = []
        
        try:
            async with httpx.AsyncClient() as client:
                ml_response = await client.post(
                    "http://localhost:8001/classify",
                    json={"text": request.query}
                )
                ml_response.raise_for_status()
                classification = ml_response.json()
                domains = classification.get("domains", ["General"])
                confidences = classification.get("confidences", [0.0])
        except Exception as e:
            yield f"data: {json.dumps({'state': 'error', 'message': f'ML Service error: {str(e)}'})}\n\n"
            return
            
        await asyncio.sleep(0.5)
        
        primary_confidence = confidences[0] if confidences else 0.0
        
        # Low confidence check
        if primary_confidence < 0.15:
            yield f"data: {json.dumps({'state': 'low_confidence', 'options': ['Finance', 'Housing', 'Academics']})}\n\n"
            return
            
        yield f"data: {json.dumps({'state': 'classification_complete', 'domains': domains, 'confidence': primary_confidence})}\n\n"
        await asyncio.sleep(0.3)
        
        yield f"data: {json.dumps({'state': 'routing_started'})}\n\n"
        await asyncio.sleep(0.3)
        
        for d in domains:
            yield f"data: {json.dumps({'state': 'agent_activated', 'agentId': d})}\n\n"
            
        await asyncio.sleep(0.2)
        
        # Execute agents sequentially (SSE requires linear yielding)
        agent_results = []
        for d in domains:
            agent = registry.get_agent(d) or BaseAgent(d, retriever)
            yield f"data: {json.dumps({'state': 'retrieving', 'agentId': d})}\n\n"
            await asyncio.sleep(0.4)
            result = await agent.handle(request.query, {})
            yield f"data: {json.dumps({'state': 'generating', 'agentId': d})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'state': 'complete', 'agentId': d})}\n\n"
            agent_results.append(result)
            
        await asyncio.sleep(0.2)
        
        # Synthesis
        all_sources = []
        all_actions = []
        answers = []
        for res in agent_results:
            all_sources.extend(res["sources"])
            all_actions.extend(res["actions"])
            answers.append(res["response"])
            
        final_answer = "\n\n".join(answers)
        
        final_response = {
            'response': final_answer,
            'domains': domains,
            'confidence': primary_confidence,
            'sources': all_sources,
            'actions': all_actions
        }
        
        yield f"data: {json.dumps({'state': 'response_complete', 'result': final_response})}\n\n"
        
    return StreamingResponse(event_generator(), media_type="text/event-stream")

