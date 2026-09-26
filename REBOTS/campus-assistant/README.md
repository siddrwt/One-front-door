# Campus Assistant AI

## Project Overview
The **Campus Assistant AI** is a multi-domain conversational interface designed to intelligently route student queries to the appropriate campus department (Academics, Admissions, Fees, Housing, etc.) and provide factual, RAG-grounded responses. 

## Architecture
This project follows a FAANG-grade architecture:
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend API Gateway**: FastAPI, PostgreSQL, Redis
- **ML Routing Engine**: DistilBERT + LoRA (Parameter-Efficient Fine-Tuning)
- **RAG Pipeline**: Qdrant Vector Store, BM25, Cross-Encoder Reranking
- **Deployment**: Docker Compose

## Repository Structure
```
campus-assistant/
├── frontend/             # React Chat Interface
├── backend/              # FastAPI Backend Gateway & RAG
├── ml_service/           # DistilBERT LoRA Classifier
├── docker/               # Docker configs
└── docker-compose.yml    # Orchestration
```

## Setup & Running Locally

1. **Install Dependencies**
   - For Backend: `cd backend && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt`
   - For ML Service: `cd ml_service && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt`
   - For Frontend: `cd frontend && npm install`

2. **Start Infrastructure**
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL, Redis, and Qdrant.

3. **Train the ML Model (Optional)**
   ```bash
   cd ml_service/scripts
   python generate_data.py
   python train_classifier.py
   ```

4. **Start the Services**
   - ML Service: `cd ml_service/src && uvicorn api:app --port 8001`
   - Backend API: `cd backend && uvicorn app.main:app --port 8000`
   - Frontend: `cd frontend && npm run dev`

## Known Limitations & Future Work
- The current ML model uses synthetic data for demonstration. In production, real campus logs should be annotated and used.
- LLM response generation is currently mocked behind an abstraction. To use OpenAI or local Ollama, update `backend/app/api/routes.py`.
