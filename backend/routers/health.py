from fastapi import APIRouter
from schemas.chat_schemas import HealthResponse
from utils.helpers import get_pkt_now

router = APIRouter()

@router.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Homeo AI Chatbot Backend is running",
        "timestamp": get_pkt_now().isoformat()
    }

@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Homeo AI Chatbot",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }
