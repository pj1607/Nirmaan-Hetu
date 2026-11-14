from google import genai
from google.genai import types

from app.core.config import settings


def get_gemini_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def embed_text(text: str, task_type: str) -> list[float]:
    client = get_gemini_client()
    response = client.models.embed_content(
        model=settings.EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    return list(response.embeddings[0].values)


def generate_answer(prompt: str) -> str:
    client = get_gemini_client()
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
    )
    return response.text or "I could not generate an answer."
