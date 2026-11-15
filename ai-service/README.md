# Nirmaan Hetu AI Service

A separate Python service for the Nirmaan Hetu RAG and agent workflows. It runs alongside the existing React frontend and Node.js backend.

## Requirements

- Python 3.11 or 3.12 recommended
- A Gemini API key for document ingestion, retrieval, and generation

## Local setup (Windows Git Bash)

From this directory:

```bash
python -m venv venv
source venv/Scripts/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
```

Add your Gemini API key to `.env`. Never commit that file.

## Run the service

From the `ai-service` directory, with the virtual environment activated:

```bash
uvicorn app.main:app --reload --port 8000
```

- Health check: http://127.0.0.1:8000/health
- Interactive API docs: http://127.0.0.1:8000/docs

## API endpoints

- `POST /api/documents/upload` — ingest a PDF into the ChromaDB knowledge base.
- `POST /api/query` — direct RAG question answering against uploaded documents.
- `POST /api/agent/query` — LangGraph agent that classifies the question, conditionally calls the document-retrieval tool, and returns an answer with sources and an execution trace.

The agent uses Gemini to choose between a document-retrieval path and a general construction-question path. Document-specific questions are answered using retrieved context and source citations; general questions do not claim to be based on uploaded files. The existing direct RAG endpoint remains available independently.

## Example agent request

```bash
curl -X POST http://127.0.0.1:8000/api/agent/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What materials are specified in my uploaded agreement?","top_k":4}'
```

The response includes `answer`, `sources`, and `agent_steps`, which make the agent's route and tool usage observable during testing.
