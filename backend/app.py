import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers.health import router as health_router
from routers.consultation import router as consultation_router
from routers.chat import router as chat_router
from routers.admin import router as admin_router

# Initialize FastAPI app
app = FastAPI(
    title="Homeopathy AI Chatbot",
    description="Case taking doctor chatbot",
    version="2.0.0"
)

# Initialize database
from db.database import engine, Base
import models.patient
import models.admin_person
Base.metadata.create_all(bind=engine)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(consultation_router)
app.include_router(chat_router)
app.include_router(admin_router)
from routers.auth import router as auth_router
app.include_router(auth_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
