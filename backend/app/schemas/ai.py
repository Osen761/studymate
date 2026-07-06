from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=500)
    top_k: int = Field(default=3, ge=1, le=10)
    distance_threshold: float = Field(default=0.8, ge=0, le=2)


class AIOutputRead(BaseModel):
    id: str
    user_id: str
    note_id: str
    type: str
    prompt: str
    output: str
    context_used: str | None = None
    sources: list[dict] = []
    created_at: str


class AIActionResponse(BaseModel):
    output: AIOutputRead


class AskResponse(BaseModel):
    answer: str
    context_used: str | None
    sources: list[dict]
    output: AIOutputRead
