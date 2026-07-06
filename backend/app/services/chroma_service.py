from app.db.chroma import get_notes_collection


def upsert_note_chunks(chunks: list[dict]) -> None:
    if not chunks:
        return

    collection = get_notes_collection()
    collection.upsert(
        ids=[chunk["id"] for chunk in chunks],
        documents=[chunk["chunk_text"] for chunk in chunks],
        metadatas=[chunk["metadata"] for chunk in chunks],
    )


def delete_note_chunks(user_id: str, note_id: str) -> None:
    collection = get_notes_collection()
    collection.delete(where={"$and": [{"user_id": user_id}, {"note_id": note_id}]})
