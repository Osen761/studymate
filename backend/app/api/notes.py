from typing import Annotated

from fastapi import APIRouter, Depends, Response, status

from app.core.security import get_current_user
from app.schemas.common import MessageResponse
from app.schemas.notes import NoteCreate, NoteListResponse, NoteRead, NoteUpdate
from app.services.notes import (
    create_note_for_user,
    delete_note_for_user,
    get_note_for_user,
    list_notes_for_user,
    update_note_for_user,
)

router = APIRouter()


@router.get("", response_model=NoteListResponse)
async def list_notes(user: Annotated[dict, Depends(get_current_user)]) -> NoteListResponse:
    return NoteListResponse(notes=list_notes_for_user(user["uid"]))


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
async def create_note(payload: NoteCreate, user: Annotated[dict, Depends(get_current_user)]) -> NoteRead:
    return NoteRead(**create_note_for_user(payload.model_dump(), user["uid"]))


@router.get("/{note_id}", response_model=NoteRead)
async def read_note(note_id: str, user: Annotated[dict, Depends(get_current_user)]) -> NoteRead:
    return NoteRead(**get_note_for_user(note_id, user["uid"]))


@router.put("/{note_id}", response_model=NoteRead)
async def update_note(note_id: str, payload: NoteUpdate, user: Annotated[dict, Depends(get_current_user)]) -> NoteRead:
    return NoteRead(**update_note_for_user(note_id, payload.model_dump(), user["uid"]))


@router.delete("/{note_id}", response_model=MessageResponse)
async def delete_note(note_id: str, user: Annotated[dict, Depends(get_current_user)], response: Response) -> MessageResponse:
    delete_note_for_user(note_id, user["uid"])
    response.status_code = status.HTTP_200_OK
    return MessageResponse(message="Note deleted.")
