from typing import Annotated, Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as firebase_auth

from app.core.firebase import initialize_firebase_admin
from app.services.users import ensure_user_document

bearer_scheme = HTTPBearer(auto_error=False)


def verify_id_token(token: str) -> dict[str, Any]:
    initialize_firebase_admin()
    try:
        return firebase_auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token.",
        ) from exc


async def get_current_user(
    request: Request,
    credentials_value: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> dict[str, Any]:
    if credentials_value is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization bearer token.",
        )

    decoded = verify_id_token(credentials_value.credentials)
    user = {
        "uid": decoded["uid"],
        "email": decoded.get("email"),
        "display_name": decoded.get("name"),
    }
    ensure_user_document(user)
    request.state.user = user
    return user
