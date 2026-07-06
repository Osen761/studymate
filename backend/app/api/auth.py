from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.firestore import get_firestore_client
from app.schemas.auth import CurrentUser

router = APIRouter()


@router.get("/me", response_model=CurrentUser)
async def read_current_user(user: Annotated[dict, Depends(get_current_user)]) -> CurrentUser:
    return CurrentUser(**user)


@router.get("/stats")
async def read_current_user_stats(user: Annotated[dict, Depends(get_current_user)]) -> dict[str, int]:
    client = get_firestore_client()
    notes = client.collection("notes").where("user_id", "==", user["uid"]).stream()
    outputs = client.collection("ai_outputs").where("user_id", "==", user["uid"]).stream()
    return {
        "total_notes": sum(1 for _ in notes),
        "total_ai_outputs": sum(1 for _ in outputs),
    }
