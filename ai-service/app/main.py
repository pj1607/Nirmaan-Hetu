from fastapi import FastAPI

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="RAG-powered AI service for Nirmaan Hetu",
    version="0.1.0",
)


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
