from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import ai, auth, notes
from app.core.config import settings
from app.core.logging import configure_logging

configure_logging()

app = FastAPI(
    title="StudyMate API",
    version="0.5.0",
    description="Notebook-to-product AI learning companion API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "studymate-backend"}


app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(notes.router, prefix="/api/v1/notes", tags=["notes"])
app.include_router(ai.router, prefix="/api/v1/notes", tags=["ai"])
