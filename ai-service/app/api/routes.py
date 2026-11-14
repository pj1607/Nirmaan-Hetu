import logging
import tempfile
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from google.genai.errors import APIError
from pydantic import BaseModel, Field, field_validator
from pypdf.errors import PdfReadError

from app.core.config import settings
from app.generation.answer_generator import generate_rag_answer
from app.ingestion.pdf_processor import extract_pdf_chunks
from app.retrieval.vector_store import add_chunks, search_chunks


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["RAG"])


class QueryRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    top_k: int = Field(default=4, ge=1, le=10)

    @field_validator("question")
    @classmethod
    def strip_question(cls, value: str) -> str:
        question = value.strip()
        if not question:
            raise ValueError("Question cannot be empty.")
        return question


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)) -> dict:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    max_upload_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    content = await file.read(max_upload_bytes + 1)
    if len(content) > max_upload_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"PDF exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB upload limit.",
        )
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=Path(file.filename).suffix,
        ) as temp_file:
            temp_path = Path(temp_file.name)
            temp_file.write(content)

        try:
            chunks = extract_pdf_chunks(temp_path)
        except (PdfReadError, ValueError) as exc:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid or readable PDF.",
            ) from exc

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No extractable text was found in the PDF. Scanned PDFs need OCR.",
            )

        document_id = str(uuid4())
        for chunk in chunks:
            chunk["metadata"]["source"] = file.filename
            chunk["metadata"]["document_id"] = document_id

        stored_chunks = add_chunks(chunks)
        return {
            "message": "Document ingested successfully.",
            "document_id": document_id,
            "filename": file.filename,
            "chunks_stored": stored_chunks,
        }
    except HTTPException:
        raise
    except APIError as exc:
        logger.exception("Gemini API failed while embedding uploaded document.")
        raise HTTPException(
            status_code=502,
            detail="The AI provider failed to process the document. Check Gemini model, API access, and quota.",
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected document upload failure.")
        raise HTTPException(
            status_code=500,
            detail="Document upload failed due to an internal server error.",
        ) from exc
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


@router.post("/query")
def query_documents(request: QueryRequest) -> dict:
    try:
        chunks = search_chunks(request.question, request.top_k)
        answer = generate_rag_answer(request.question, chunks)

        sources = [
            {
                "document_id": item["metadata"].get("document_id"),
                "source": item["metadata"]["source"],
                "page": item["metadata"]["page"],
                "distance": item["distance"],
            }
            for item in chunks
        ]

        return {
            "question": request.question,
            "answer": answer,
            "sources": sources,
        }
    except APIError as exc:
        logger.exception("Gemini API failed while answering a document query.")
        raise HTTPException(
            status_code=502,
            detail="The AI provider failed to answer the question. Check Gemini model, API access, and quota.",
        ) from exc
    except RuntimeError as exc:
        logger.exception("AI service configuration error during document query.")
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected document query failure.")
        raise HTTPException(
            status_code=500,
            detail="Document query failed due to an internal server error.",
        ) from exc
