from functools import lru_cache

import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

from app.core.config import settings

COLLECTION_NAME = "studymate_notes"


@lru_cache
def get_chroma_client() -> chromadb.PersistentClient:
    return chromadb.PersistentClient(path=settings.chroma_persist_dir)


@lru_cache
def get_notes_collection():
    embedding_function = SentenceTransformerEmbeddingFunction(model_name=settings.embedding_model)
    return get_chroma_client().get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_function,
        metadata={"hnsw:space": "cosine"},
    )
