from pathlib import Path

from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter


def extract_pdf_chunks(file_path: Path) -> list[dict]:
    reader = PdfReader(str(file_path))
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=120,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks: list[dict] = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if not text:
            continue

        page_chunks = splitter.split_text(text)
        for chunk_index, chunk in enumerate(page_chunks):
            chunks.append(
                {
                    "text": chunk,
                    "metadata": {
                        "source": file_path.name,
                        "page": page_number,
                        "chunk": chunk_index,
                    },
                }
            )

    return chunks
