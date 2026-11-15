# Secure Owner AI Service Setup

The React application must call the Node.js backend for AI requests. The Node.js backend verifies the existing JWT and Owner role, then forwards the request to FastAPI using a private shared secret and the authenticated Owner ID.

## Local environment

1. Keep the existing values in `backend/.env`. Add:

```env
AI_SERVICE_URL=http://127.0.0.1:8000
AI_INTERNAL_API_KEY=<same-long-random-secret-used-by-ai-service>
```

2. Keep the existing values in `ai-service/.env`. Add:

```env
INTERNAL_AI_API_KEY=<same-long-random-secret-used-by-backend>
```

Generate a secret locally (do not commit it):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the generated value for both variables. Never expose it in React/Vite environment variables or commit either real `.env` file.

3. In `frontend/.env`, keep:

```env
VITE_API_URL=http://localhost:4000
```

The frontend no longer calls the FastAPI URL directly.

## Production environment

- Node.js backend: set `AI_SERVICE_URL` to the deployed FastAPI service URL and `AI_INTERNAL_API_KEY` to the private shared secret.
- FastAPI service: set `INTERNAL_AI_API_KEY` to the exact same secret and configure `GEMINI_API_KEY`.
- React/Vercel: set `VITE_API_URL` to the deployed Node.js backend URL. Do not set a public `VITE_AI_SERVICE_URL`.
- Use HTTPS between deployed services. Keep the shared secret only in backend/server environment settings.

## Data isolation and existing uploads

Every new PDF chunk is tagged with its Owner ID in ChromaDB. Every document retrieval query filters by that Owner ID. Builder users and unauthenticated requests are rejected by the Node.js AI routes.

PDFs uploaded before this change do not have an Owner ID in their ChromaDB metadata, so they are intentionally excluded from the new owner-scoped searches. Upload those PDFs again after deploying this change.

## Persistent storage requirement

ChromaDB currently stores its database under `ai-service/data/chroma_db`. A production host must provide a persistent disk/volume mounted so this directory survives service restarts and redeployments. An ephemeral filesystem can lose uploaded document indexes.
