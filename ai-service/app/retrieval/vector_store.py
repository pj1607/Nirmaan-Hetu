from pathlib import Path

import chromadb

from app.core.config import settings
from app.core.gemini import embed_text


CHROMA_PATH = Path(__file__).resolve().parents[2] / "data" / "chroma_db"
COLLECTION_NAME = "nirmaan_hetu_documents"


def get_collection():
    CHROMA_PATH.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Nirmaan Hetu RAG document chunks"},
    )


def add_chunks(chunks: list[dict]) -> int:
    if not chunks:
        return 0

    collection = get_collection()
    ids = [
        f"{item['metadata']['source']}:{item['metadata']['page']}:{item['metadata']['chunk']}"
        for item in chunks
    ]
    embeddings = [
        embed_text(item["text"], "RETRIEVAL_DOCUMENT")
        for item in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=[item["text"] for item in chunks],
        metadatas=[item["metadata"] for item in chunks],
        embeddings=embeddings,
    )
    return len(chunks)


def search_chunks(query: str, top_k: int = 4) -> list[dict]:
    collection = get_collection()

    if collection.count() == 0:
        return []

    query_embedding = embed_text(query, "RETRIEVAL_QUERY")
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    return [
        {
            "text": document,
            "metadata": metadata,
            "distance": distance,
        }
        for document, metadata, distance in zip(
            documents, metadatas, distances
        )
    ]
