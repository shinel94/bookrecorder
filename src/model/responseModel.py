from pydantic import BaseModel
from typing import Any, List


class ReturnResponseModel(BaseModel):
    success: bool
    message: str
    data: Any = None


class RegisterModel(BaseModel):
    id: str
    pwd: str
    nickname: str


class LoginModel(BaseModel):
    id: str
    pwd: str


class LogoutModel(BaseModel):
    id: str


class BookSearchModel(BaseModel):
    id: str
    token: str
    keyword: str