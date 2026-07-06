import firebase_admin
from firebase_admin import credentials

from app.core.config import settings


def initialize_firebase_admin() -> None:
    if firebase_admin._apps:
        return

    credential = credentials.Certificate(
        {
            "type": "service_account",
            "project_id": settings.firebase_project_id,
            "private_key": settings.firebase_private_key_value,
            "client_email": settings.firebase_client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    )
    firebase_admin.initialize_app(credential, {"projectId": settings.firebase_project_id})
