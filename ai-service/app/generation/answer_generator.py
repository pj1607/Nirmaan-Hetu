from app.core.gemini import generate_answer


def generate_rag_answer(question: str, retrieved_chunks: list[dict]) -> str:
    if not retrieved_chunks:
        return "I could not find relevant information in the uploaded documents."

    context_parts = []
    for index, item in enumerate(retrieved_chunks, start=1):
        metadata = item["metadata"]
        context_parts.append(
            f"[Source {index}: {metadata['source']}, page {metadata['page']}]\n"
            f"{item['text']}"
        )

    context = "\n\n".join(context_parts)

    prompt = f"""You are the Nirmaan Hetu construction assistant.

Answer the user's question using only the provided document context.
If the context does not contain enough information, say that you do not have
enough information from the uploaded documents.

Always cite supporting sources in this format:
[Source N: filename, page X]

Question:
{question}

Document context:
{context}
"""

    return generate_answer(prompt)
