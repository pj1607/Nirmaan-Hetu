import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

from app.generation.answer_generator import generate_rag_answer
from app.ingestion.pdf_processor import extract_pdf_chunks
from app.retrieval.vector_store import add_chunks, search_chunks


router = APIRouter(prefix="/api", tags=["RAG"])


class QueryRequest(BaseModel):
    question: str = Field(min_length=1)
    top_k: int = Field(default=4, ge=1, le=10)


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)) -> dict:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_path = Path(temp_file.name)
        temp_file.write(await file.read())

    try:
        chunks = extract_pdf_chunks(temp_path)
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No extractable text was found in the PDF.",
            )

        for chunk in chunks:
            chunk["metadata"]["source"] = file.filename

        stored_chunks = add_chunks(chunks)

        return {
            "message": "Document ingested successfully.",
            "filename": file.filename,
            "chunks_stored": stored_chunks,
        }
    finally:
        temp_path.unlink(missing_ok=True)


@router.post("/query")
def query_documents(request: QueryRequest) -> dict:
    try:
        chunks = search_chunks(request.question, request.top_k)
        answer = generate_rag_answer(request.question, chunks)

        sources = [
            {
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
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
