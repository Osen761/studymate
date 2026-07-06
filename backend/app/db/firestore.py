from functools import lru_cache

from google.cloud import firestore

from app.core.config import settings
from app.core.firebase import initialize_firebase_admin


@lru_cache
def get_firestore_client() -> firestore.Client:
    initialize_firebase_admin()
    if settings.firestore_database_id:
        return firestore.Client(project=settings.firebase_project_id, database=settings.firestore_database_id)
    return firestore.Client(project=settings.firebase_project_id)
