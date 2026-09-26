from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class CampusRetriever:
    """RAG retriever that connects to Qdrant for document retrieval.
    
    Loads embedding and reranker models lazily to avoid crashing
    if the models haven't been downloaded yet.
    """
    def __init__(self, qdrant_host: str = "localhost", qdrant_port: int = 6333, collection_name: str = "campus_knowledge"):
        self.qdrant_host = qdrant_host
        self.qdrant_port = qdrant_port
        self.collection_name = collection_name
        self._client = None
        self._embedder = None
        self._reranker = None
        self._initialized = False
        
    def _lazy_init(self):
        """Lazily initialize heavy dependencies so the app can start even without Qdrant."""
        if self._initialized:
            return
        try:
            from qdrant_client import QdrantClient
            from sentence_transformers import SentenceTransformer, CrossEncoder
            
            self._client = QdrantClient(
                host=self.qdrant_host,
                port=self.qdrant_port,
                timeout=3,
                prefer_grpc=False,
            )
            self._embedder = SentenceTransformer("all-MiniLM-L6-v2")
            self._reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
            self._initialized = True
            logger.info("CampusRetriever initialized successfully")
        except Exception as e:
            logger.warning(f"CampusRetriever initialization failed: {e}. RAG will return empty results.")
            self._initialized = False
        
    def retrieve(self, query: str, domain: Optional[str] = None, top_k: int = 5, rerank_k: int = 3) -> List[Dict[str, Any]]:
        self._lazy_init()
        
        if not self._initialized or self._client is None:
            return []
        
        if self._embedder is None or self._reranker is None:
            return []
        
        try:
            from qdrant_client.http.models import Filter, FieldCondition, MatchValue
            
            query_vector = self._embedder.encode(query).tolist()
            
            # Domain filtering
            query_filter = None
            if domain and domain != "General":
                query_filter = Filter(
                    must=[
                        FieldCondition(
                            key="domain",
                            match=MatchValue(value=domain)
                        )
                    ]
                )
                
            search_result = self._client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=query_filter,
                limit=top_k
            )
            
            if not search_result:
                return []
                
            candidates = [hit.payload for hit in search_result]
            
            # Reranking
            pairs = [[query, doc.get("text", "")] for doc in candidates]
            scores = self._reranker.predict(pairs)
            
            ranked_docs = []
            for i in range(len(candidates)):
                candidates[i]["rerank_score"] = float(scores[i])
                ranked_docs.append(candidates[i])
                
            ranked_docs.sort(key=lambda x: x["rerank_score"], reverse=True)
            return ranked_docs[:rerank_k]
            
        except Exception as e:
            logger.warning(f"Retrieval error: {e}")
            return []
