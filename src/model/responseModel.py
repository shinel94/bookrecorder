from pydantic import BaseModel
from typing import Any, List, Union


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


class UpdateAppliedBookInfoModel(BaseModel):
    id: str
    token: str
    isbn: str
    start_date: Union[str, None]
    finish_date: Union[str, None]
    status: Union[int, None]
    rate: Union[int, None]


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


class ReviewSearchModel(BaseModel):
    id: str
    token: str
    isbn: str


class ReviewSearchByBookModel(BaseModel):
    id: str
    token: str
    isbn: str


class ReviewSearchByUserModel(BaseModel):
    id: str
    token: str
    target_nickname: str


class ReviewScore(BaseModel):
    interest: int
    readability: int
    quantity: int
    total: int


class PostReviewModel(BaseModel):
    id: str
    token: str
    isbn: str
    review: str
    score: ReviewScore
    range: int


class DeleteReviewModel(BaseModel):
    id: str
    token: str
    isbn: str


class UpdateReviewModel(BaseModel):
    id: str
    token: str
    isbn: str
    review: str
    score: ReviewScore
    range: int


class AddCommentModel(BaseModel):
    id: str
    token: str
    target_user_id: str
    isbn: str
    comment: str

class DeleteCommentModel(BaseModel):
    id: str
    token: str
    target_user_id: str
    isbn: str


