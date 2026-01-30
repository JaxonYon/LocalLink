from pydantic import BaseModel


class UserAuth(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    email: str
    name: str
    age: int
    gender: str
