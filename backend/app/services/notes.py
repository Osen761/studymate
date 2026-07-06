from fastapi import HTTPException, status
from google.cloud.firestore import Client

from app.db.firestore import get_firestore_client
from app.services.chroma_service import delete_note_chunks, upsert_note_chunks
from app.services.chunking import chunk_text
from app.utils.ids import new_id
from app.utils.time import utc_now_iso


def _note_ref(note_id: str, db: Client):
    return db.collection("notes").document(note_id)


def _snapshot_to_dict(snapshot) -> dict:
    data = snapshot.to_dict() or {}
    data["id"] = snapshot.id
    return data


def get_note_for_user(note_id: str, user_id: str, db: Client | None = None) -> dict:
    client = db or get_firestore_client()
    snapshot = _note_ref(note_id, client).get()
    if not snapshot.exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found.")
    note = _snapshot_to_dict(snapshot)
    if note.get("user_id") != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found.")
    return note


def list_notes_for_user(user_id: str, db: Client | None = None) -> list[dict]:
    client = db or get_firestore_client()
    stream = (
        client.collection("notes")
        .where("user_id", "==", user_id)
        .order_by("updated_at", direction="DESCENDING")
        .stream()
    )
    return [_snapshot_to_dict(snapshot) for snapshot in stream]


def create_note_for_user(payload: dict, user_id: str, db: Client | None = None) -> dict:
    client = db or get_firestore_client()
    now = utc_now_iso()
    note_id = new_id("note")
    note = {
        "id": note_id,
        "user_id": user_id,
        "title": payload["title"],
        "course": payload.get("course"),
        "topic": payload.get("topic"),
        "content": payload["content"],
        "created_at": now,
        "updated_at": now,
    }
    _note_ref(note_id, client).set(note)
    replace_note_chunks(note, client)
    return note


def update_note_for_user(note_id: str, payload: dict, user_id: str, db: Client | None = None) -> dict:
    client = db or get_firestore_client()
    existing = get_note_for_user(note_id, user_id, client)
    note = {
        **existing,
        "title": payload["title"],
        "course": payload.get("course"),
        "topic": payload.get("topic"),
        "content": payload["content"],
        "updated_at": utc_now_iso(),
    }
    _note_ref(note_id, client).set(note)
    replace_note_chunks(note, client)
    return note


def delete_note_for_user(note_id: str, user_id: str, db: Client | None = None) -> None:
    client = db or get_firestore_client()
    get_note_for_user(note_id, user_id, client)
    delete_chunks_for_note(user_id, note_id, client)

    for output in client.collection("ai_outputs").where("user_id", "==", user_id).where("note_id", "==", note_id).stream():
        output.reference.delete()

    _note_ref(note_id, client).delete()


def replace_note_chunks(note: dict, db: Client | None = None) -> list[dict]:
    client = db or get_firestore_client()
    delete_chunks_for_note(note["user_id"], note["id"], client)

    now = utc_now_iso()
    chunks = []
    for index, text in enumerate(chunk_text(note["content"])):
        chunk_id = new_id("chunk")
        metadata = {
            "user_id": note["user_id"],
            "note_id": note["id"],
            "chunk_index": index,
            "title": note["title"],
            "course": note.get("course") or "",
            "topic": note.get("topic") or "",
            "source": "note",
        }
        chunk = {
            "id": chunk_id,
            "note_id": note["id"],
            "user_id": note["user_id"],
            "chunk_text": text,
            "chunk_index": index,
            "metadata": metadata,
            "created_at": now,
        }
        client.collection("note_chunks").document(chunk_id).set(chunk)
        chunks.append(chunk)

    upsert_note_chunks(chunks)
    return chunks


def delete_chunks_for_note(user_id: str, note_id: str, db: Client | None = None) -> None:
    client = db or get_firestore_client()
    for chunk in client.collection("note_chunks").where("user_id", "==", user_id).where("note_id", "==", note_id).stream():
        chunk.reference.delete()
    delete_note_chunks(user_id, note_id)
