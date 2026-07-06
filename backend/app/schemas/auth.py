from pydantic import BaseModel, EmailStr


class CurrentUser(BaseModel):
    uid: str
    email: EmailStr | None = None
    display_name: str | None = None
    role: str = "student"
