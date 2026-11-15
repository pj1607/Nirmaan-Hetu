from fastapi import FastAPI

from app.api.routes import agent_router, router as rag_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    description="RAG-powered and agentic AI service for Nirmaan Hetu",
    version="0.3.0",
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
