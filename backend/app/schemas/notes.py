from pydantic import BaseModel, Field


class NoteBase(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    course: str | None = Field(default=None, max_length=120)
    topic: str | None = Field(default=None, max_length=120)
    content: str = Field(min_length=1)


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    pass


class NoteRead(NoteBase):
    id: str
    user_id: str
    created_at: str
    updated_at: str


class NoteListResponse(BaseModel):
    notes: list[NoteRead]
