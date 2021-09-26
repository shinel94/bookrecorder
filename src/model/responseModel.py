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


class BookApplyModel(BaseModel):
    id: str
    token: str
    title: str
    author: str
    publisher: str
    category: str
    isbn: str
    thumbnail: str


class AppliedBookInfoModel(BaseModel):
    id: str
    token: str
    applied_book_index: str


class AppliedBookListModel(BaseModel):
    id: str
    token: str


class AppliedBookListByConditionModel(BaseModel):
    id: str
    token: str
    start_date: str
    end_date: str
    rate: str = None
    category: str = None


class AppliedBookStaticsModel(BaseModel):
    id: str
    token: str


class AppliedBookStatusModel(BaseModel):
    id: str
    token: str
    applied_book_index: str
    status: int


class ReviwSearchModel(BaseModel):
    id: str
    token: str
    isbn: str
