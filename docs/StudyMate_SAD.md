# StudyMate Software Architecture Document

## Context

StudyMate uses a Next.js frontend and FastAPI backend. Firebase Auth provides identity, Firestore stores application metadata, ChromaDB stores vectors, and Cortex AI Gateway brokers model calls.

## Runtime Flow

Browser -> Next.js -> FastAPI -> Firestore -> ChromaDB -> Cortex -> Vertex Gemini -> FastAPI -> Next.js.

## Boundaries

- The frontend owns UI and Firebase client sign-in.
- The backend owns token verification, ownership checks, AI calls, prompts, retrieval, and persistence.
- Cortex secrets exist only in backend environment variables.
- StudyMate does not call Vertex AI or Google Gemini SDK directly.

## Backend Modules

- `api/`: HTTP routes.
- `core/`: config, logging, Firebase Admin initialization, security dependencies.
- `db/`: Firestore and ChromaDB adapters.
- `services/`: notes, chunks, embeddings, retrieval, Cortex, prompts, RAG, and AI actions.
- `schemas/`: Pydantic request and response models.

## Persistence

Firestore collections: `users`, `notes`, `note_chunks`, and `ai_outputs`.

ChromaDB collection: `studymate_notes`, persisted at `CHROMA_PERSIST_DIR`.
