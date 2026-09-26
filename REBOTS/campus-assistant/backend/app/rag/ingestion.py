import uuid
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct

class DocumentIngester:
    def __init__(self, qdrant_host: str = "localhost", qdrant_port: int = 6333, collection_name: str = "campus_knowledge"):
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = collection_name
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        
        self._ensure_collection()
        
    def _ensure_collection(self):
        if not self.client.collection_exists(collection_name=self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE)
            )

    def ingest_documents(self, documents: List[Dict[str, Any]]):
        """
        documents format:
        [
            {"text": "document text...", "domain": "Academics", "title": "Doc 1"}, ...
        ]
        """
        if not documents:
            return
            
        texts = [doc["text"] for doc in documents]
        embeddings = self.embedder.encode(texts)
        
        points = []
        for i, doc in enumerate(documents):
            points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embeddings[i].tolist(),
                    payload={
                        "text": doc["text"],
                        "domain": doc.get("domain", "General"),
                        "title": doc.get("title", "Untitled"),
                        "source": doc.get("source", "Unknown")
                    }
                )
            )
            
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        print(f"Ingested {len(points)} documents into Qdrant collection {self.collection_name}.")
