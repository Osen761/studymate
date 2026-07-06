from google.cloud.firestore import Client

from app.db.firestore import get_firestore_client
from app.utils.time import utc_now_iso


def ensure_user_document(user: dict, db: Client | None = None) -> dict:
    client = db or get_firestore_client()
    uid = user["uid"]
    ref = client.collection("users").document(uid)
    snapshot = ref.get()
    now = utc_now_iso()

    if snapshot.exists:
        ref.update({"updated_at": now})
        data = snapshot.to_dict() or {}
        data["updated_at"] = now
        return data

    payload = {
        "uid": uid,
        "email": user.get("email"),
        "display_name": user.get("display_name"),
        "role": "student",
        "created_at": now,
        "updated_at": now,
    }
    ref.set(payload)
    return payload
