# StudyMate

StudyMate v0.5 is a production-ready notebook-to-product monorepo for the AI Engineering Track. Students can authenticate, create study notes, store chunks and embeddings, retrieve relevant note context, and ask Cortex-powered RAG questions.

## Architecture

Browser -> Next.js frontend -> FastAPI backend -> Firestore metadata -> ChromaDB vectors -> Cortex AI Gateway -> Vertex Gemini.

The frontend never calls Cortex and never receives `CORTEX_API_KEY`. The backend verifies Firebase ID tokens, derives `user_id` from the token, enforces note ownership, performs chunking/retrieval, calls Cortex, and saves AI outputs.

## Monorepo

- `frontend/`: Next.js 15, TypeScript, App Router, Tailwind, Firebase Auth client SDK.
- `backend/`: Python 3.12, FastAPI, Firebase Admin, Firestore, ChromaDB, sentence-transformers, Cortex REST client.
- `docs/`: PRD, architecture, API docs, local development, ADRs, and Week 3 product map.
- `notebooks/`, `slides/`, `docker/`: course assets and deployment helpers.

## Setup

1. Create Firebase project credentials and enable Firebase Auth providers.
2. Copy `backend/.env.example` to `backend/.env`.
3. Copy `frontend/.env.example` to `frontend/.env.local`.
4. Fill Firebase and Cortex values.

Backend env:

- `CORS_ORIGINS`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIRESTORE_DATABASE_ID` optional
- `CHROMA_PERSIST_DIR` default `./chroma_db`
- `EMBEDDING_MODEL` default `all-MiniLM-L6-v2`
- `CORTEX_URL`
- `CORTEX_API_KEY`
- `CORTEX_MODEL` default `gemini-2.5-flash`

Frontend env:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_BACKEND_URL`

## Run Locally

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./scripts/dev_server.sh
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Docker compose:

```bash
docker compose up --build
```

ChromaDB persists through the `chroma-data` Docker volume or `backend/chroma_db/` locally.

If you prefer to run Uvicorn directly on Linux and hit `OS file watch limit reached`,
use polling for the reload watcher:

```bash
WATCHFILES_FORCE_POLLING=true uvicorn app.main:app --reload --reload-dir app
```

## Firebase Setup

Use Firebase Auth on the frontend. Create a Firebase service account for the backend and place the service account `project_id`, `client_email`, and escaped private key in `backend/.env`.

## Cortex Setup

Set `CORTEX_URL`, `CORTEX_API_KEY`, and optionally `CORTEX_MODEL`. StudyMate calls:

`POST {CORTEX_URL}/v1/models/{CORTEX_MODEL}:generateContent`

## v0.5 Scope

Included: authentication, notes, prompt engineering, Cortex AI Gateway integration, chunking, embeddings, persistent ChromaDB storage, retrieval, and RAG question answering.

Not included yet: LangChain, PDF upload, payments, and admin dashboards.

## Roadmap

- v0.6: LangChain refactor after students understand the direct implementation.
- v0.7: document upload and richer source views.
- v0.8: study plans, spaced repetition, and collaborative course spaces.
