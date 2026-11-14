# Nirmaan Hetu AI Service

A separate Python service for the Nirmaan Hetu RAG and agent workflows. It runs alongside the existing React frontend and Node.js backend.

## Requirements

- Python 3.11 or 3.12 recommended
- A Gemini API key for later Gemini-powered ingestion and generation steps

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

The health endpoint does not require a Gemini API key. Gemini integration is added in subsequent RAG steps.
