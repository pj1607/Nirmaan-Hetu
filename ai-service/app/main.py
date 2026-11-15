from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import agent_router, router as rag_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    description="RAG-powered and agentic AI service for Nirmaan Hetu",
    version="0.3.0",
)

# Allow the React app to call this service from local development and production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://nirmaan-hetu.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag_router)
app.include_router(agent_router)


@app.get("/", tags=["General"])
def home() -> dict[str, str]:
    return {
        "message": "Welcome to Nirmaan Hetu AI Service",
        "status": "running",
    }


@app.get("/health", tags=["General"])
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
    }
