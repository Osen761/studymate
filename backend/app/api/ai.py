from typing import Annotated, Awaitable, Callable

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.db.firestore import get_firestore_client
from app.schemas.ai import AIActionResponse, AIOutputRead, AskRequest, AskResponse
from app.services.explanations import explain_note
from app.services.keypoints import extract_key_points
from app.services.notes import get_note_for_user
from app.services.quiz import generate_quiz
from app.services.rag import answer_question_from_note
from app.services.summary import summarize_note
from app.utils.ids import new_id
from app.utils.time import utc_now_iso

router = APIRouter()


def _save_ai_output(
    *,
    user_id: str,
    note_id: str,
    output_type: str,
    prompt: str,
    output: str,
    context_used: str | None = None,
    sources: list[dict] | None = None,
) -> dict:
    client = get_firestore_client()
    output_id = new_id("out")
    payload = {
        "id": output_id,
        "user_id": user_id,
        "note_id": note_id,
        "type": output_type,
        "prompt": prompt,
        "output": output,
        "context_used": context_used,
        "sources": sources or [],
        "created_at": utc_now_iso(),
    }
    client.collection("ai_outputs").document(output_id).set(payload)
    return payload


async def _run_ai_action(
    *,
    note_id: str,
    user: dict,
    output_type: str,
    action: Callable[[dict], Awaitable[tuple[str, str]]],
) -> AIActionResponse:
    note = get_note_for_user(note_id, user["uid"])
    prompt, output = await action(note)
    saved = _save_ai_output(
        user_id=user["uid"],
        note_id=note_id,
        output_type=output_type,
        prompt=prompt,
        output=output,
    )
    return AIActionResponse(output=AIOutputRead(**saved))


@router.get("/{note_id}/outputs", response_model=list[AIOutputRead])
async def list_ai_outputs(note_id: str, user: Annotated[dict, Depends(get_current_user)]) -> list[AIOutputRead]:
    get_note_for_user(note_id, user["uid"])
    client = get_firestore_client()
    stream = (
        client.collection("ai_outputs")
        .where("user_id", "==", user["uid"])
        .where("note_id", "==", note_id)
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )
    return [AIOutputRead(**(snapshot.to_dict() or {})) for snapshot in stream]


@router.post("/{note_id}/summary", response_model=AIActionResponse)
async def create_summary(note_id: str, user: Annotated[dict, Depends(get_current_user)]) -> AIActionResponse:
    return await _run_ai_action(note_id=note_id, user=user, output_type="summary", action=summarize_note)


@router.post("/{note_id}/quiz", response_model=AIActionResponse)
async def create_quiz(note_id: str, user: Annotated[dict, Depends(get_current_user)]) -> AIActionResponse:
    return await _run_ai_action(note_id=note_id, user=user, output_type="quiz", action=generate_quiz)


@router.post("/{note_id}/explanation", response_model=AIActionResponse)
async def create_explanation(note_id: str, user: Annotated[dict, Depends(get_current_user)]) -> AIActionResponse:
    return await _run_ai_action(note_id=note_id, user=user, output_type="explanation", action=explain_note)


@router.post("/{note_id}/key-points", response_model=AIActionResponse)
async def create_key_points(note_id: str, user: Annotated[dict, Depends(get_current_user)]) -> AIActionResponse:
    return await _run_ai_action(note_id=note_id, user=user, output_type="key_points", action=extract_key_points)


@router.post("/{note_id}/ask", response_model=AskResponse)
async def ask_note(note_id: str, payload: AskRequest, user: Annotated[dict, Depends(get_current_user)]) -> AskResponse:
    note = get_note_for_user(note_id, user["uid"])
    result = await answer_question_from_note(
        note=note,
        user_id=user["uid"],
        question=payload.question,
        top_k=payload.top_k,
        distance_threshold=payload.distance_threshold,
    )
    saved = _save_ai_output(
        user_id=user["uid"],
        note_id=note_id,
        output_type="answer",
        prompt=result["prompt"],
        output=result["answer"],
        context_used=result["context_used"],
        sources=result["sources"],
    )
    return AskResponse(
        answer=result["answer"],
        context_used=result["context_used"],
        sources=result["sources"],
        output=AIOutputRead(**saved),
    )
