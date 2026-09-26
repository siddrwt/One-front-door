from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Campus Assistant API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Campus Assistant API"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

from app.api.routes import router as chat_router
app.include_router(chat_router, prefix="/api/v1")
