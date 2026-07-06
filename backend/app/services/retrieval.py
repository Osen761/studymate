from dataclasses import dataclass

from app.db.chroma import get_notes_collection


@dataclass
class RetrievedChunk:
    id: str
    text: str
    distance: float | None
    metadata: dict


def retrieve_note_chunks(
    *,
    user_id: str,
    note_id: str,
    question: str,
    top_k: int,
    distance_threshold: float,
) -> list[RetrievedChunk]:
    collection = get_notes_collection()
    result = collection.query(
        query_texts=[question],
        n_results=top_k,
        where={"$and": [{"user_id": user_id}, {"note_id": note_id}]},
    )

    ids = result.get("ids", [[]])[0]
    documents = result.get("documents", [[]])[0]
    metadatas = result.get("metadatas", [[]])[0]
    distances = result.get("distances", [[]])[0]

    chunks: list[RetrievedChunk] = []
    for chunk_id, document, metadata, distance in zip(ids, documents, metadatas, distances, strict=False):
        if distance is not None and distance > distance_threshold:
            continue
        chunks.append(
            RetrievedChunk(
                id=chunk_id,
                text=document,
                distance=distance,
                metadata=metadata or {},
            )
        )
    return chunks


def build_context(chunks: list[RetrievedChunk]) -> tuple[str, list[dict]]:
    context_parts: list[str] = []
    sources: list[dict] = []

    for index, chunk in enumerate(chunks, start=1):
        title = chunk.metadata.get("title") or "Untitled note"
        course = chunk.metadata.get("course") or "No course"
        topic = chunk.metadata.get("topic") or "No topic"
        chunk_index = chunk.metadata.get("chunk_index")
        context_parts.append(
            f"[Source {index}: {title} | {course} | {topic} | chunk {chunk_index}]\n{chunk.text}"
        )
        sources.append(
            {
                "source_number": index,
                "chunk_id": chunk.id,
                "note_id": chunk.metadata.get("note_id"),
                "title": title,
                "course": course,
                "topic": topic,
                "chunk_index": chunk_index,
                "distance": chunk.distance,
            }
        )

    return "\n\n".join(context_parts), sources
