from typing import List

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
import src.model.responseModel as Model
from src.model.dbModel import User, Book, Review, AppliedBook
from src.util.security import generate_token, string_encoding, check_token
from src.util.book_search_api import search_book_by_keyword
from src.util.string_util import get_date_string, get_date_from_string
from src.util.constant import G_BOOK_STATUS_FINISH
from src.util.io_util import load_json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/{a_text}', response_class=HTMLResponse)
def hello(a_text: str):
    return f'<h1>hello {a_text}</h1>'


@app.get('/', response_class=HTMLResponse)
def hello():
    return f'<h1>hello main</h1>'


@app.post('/api/book/search',
          tags=['BOOK'],
          response_model=Model.ReturnResponseModel)
def search_book(a_response: Model.BookSearchModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    searched_book_list = search_book_by_keyword(a_response.keyword)
    return {
            "success": True,
            "message": "Please Check Data",
            "data": searched_book_list
        }

@app.post('/api/book/apply',
          tags=['BOOK'],
          response_model=Model.ReturnResponseModel)
def apply_book(a_response: Model.BookApplyModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    book_list: List[Book] = Book.select(title=a_response.title, isbn=a_response.isbn)
    if len(book_list) == 0:
        book_index = Book.get_index()
        book = Book(book_index, a_response.title, a_response.author, a_response.publisher, a_response.category, a_response.isbn, a_response.thumbnail, 1, 0)
        book.insert()
    else:
        book = book_list[0]
        book.read += 1
        book.update()
    user = User.select(id=a_response.id)[0]
    applied_book_list = AppliedBook.select(user_index=user.index, book_index=book.index)
    if len(applied_book_list) != 0:
        return {
            "success": False,
            "message": "Book Already Applied!",
            "data": None
        }
    else:
        pass
        applied_book_index = AppliedBook.get_index()
        applied_book = AppliedBook(applied_book_index, user.index, book.index, get_date_string(), None, 3, 0, 0)
        applied_book.insert()
        return {
            "success": False,
            "message": "Success Book Apply!",
            "data": None
        }

@app.post(
    '/api/book/info',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel)
def get_applied_book_info(a_response: Model.AppliedBookInfoModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    applied_book_list = AppliedBook.select(index=a_response.applied_book_index)
    if len(applied_book_list) == 0:
        return {
            "success": False,
            "message": "Incorrect Requests",
            "data": None
        }
    applied_book = applied_book_list[0]
    book = Book.select(index=applied_book.book_index)[0]
    return {
        "success": True,
        "message": "",
        "data": {
            'title': book.title,
            'author': book.author,
            'category': book.category,
            'image': book.thumbnail,
            'start_date': applied_book.start_date,
            'finish_date': applied_book.finish_date,
            'status': applied_book.status
        }
    }


@app.post(
    '/api/book/list',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def get_applied_book_list(a_response:Model.AppliedBookListModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    try:
        user = User.select(id=a_response.id)[0]
    except IndexError:
        return {
            "success": False,
            "message": "Incorrect Requests",
            "data": None
        }

    applied_book_list = AppliedBook.select(user_index=user.index)
    data = []
    for applied_book in applied_book_list:
        try:
            book = Book.select(index=applied_book.book_index)[0]
            data.append(
                {
                    'title': book.title,
                    'author': book.author,
                    'isbn': book.isbn,
                    'category': book.category,
                    'image': book.thumbnail,
                    'start_date': applied_book.start_date,
                    'finish_date': applied_book.finish_date,
                    'status': applied_book.status,
                    'rate': applied_book.rate
                }
            )
        except IndexError:
            continue
    return {
        "success": True,
        "message": "",
        "data": data
    }


@app.post(
    '/api/book/list/condition',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def get_applied_book_list_by_condition(a_response:Model.AppliedBookListByConditionModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    try:
        user = User.select(id=a_response.id)[0]
    except IndexError:
        return {
            "success": False,
            "message": "Incorrect Requests",
            "data": None
        }

    applied_book_list = AppliedBook.select(user_index=user.index)
    data = []
    for applied_book in applied_book_list:
        try:

            validate = True
            validate = validate and ((get_date_from_string(applied_book.start_date) - get_date_from_string(a_response.start_date)).total_seconds() >= 0)
            validate = validate and ((get_date_from_string(applied_book.start_date) - get_date_from_string(a_response.end_date)).total_seconds() <= 0)
            if a_response.rate is not None:
                validate = validate and (applied_book.rate == a_response.rate)
            book: Book = Book.select(index=applied_book.book_index)[0]
            if a_response.category is not None:
                validate = validate and (book.category == a_response.category)
            if validate:
                data.append(
                    {
                        'title': book.title,
                        'author': book.author,
                        'category': book.category,
                        'image': book.thumbnail,
                        'start_date': applied_book.start_date,
                        'finish_date': applied_book.finish_date,
                        'status': applied_book.status,
                        'rate': applied_book.rate
                    }
                )
        except IndexError:
            continue
    return {
        "success": True,
        "message": "",
        "data": data
    }


@app.post(
    '/apo/book/statics',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def get_applied_book_statics(a_response: Model.AppliedBookStaticsModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    return {
        "success": True,
        "message": "Statics Not Developed Yet",
        "data": None
    }


@app.post(
    '/apo/book/status',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def get_applied_book_status(a_response:Model.AppliedBookStatusModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    applied_book_list = AppliedBook.select(index=a_response.applied_book_index)
    if len(applied_book_list) == 0:
        return {
            "success": False,
            "message": "Incorrect Requests",
            "data": None
        }
    applied_book = applied_book_list[0]
    applied_book.status = a_response.status
    if a_response.status == G_BOOK_STATUS_FINISH:
        applied_book.finish_date = get_date_string()

    return {
        "success": True,
        "message": "Book Status Change Success",
        "data": None
    }


@app.post(
    '/apo/review/post',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def post_review(a_response):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    raise NotImplementedError


@app.post(
    '/apo/review/search/user',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def search_review_by_user(a_response):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    raise NotImplementedError


@app.post(
    '/apo/review/search/book',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def search_review_by_book(a_response):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    raise NotImplementedError


@app.post(
    '/apo/review/search',
    tags=['BOOK'],
    response_model=Model.ReturnResponseModel
)
def search_review(a_response: Model.ReviwSearchModel):
    if not check_token(a_response.id, a_response.token):
        return {
            "success": False,
            "message": "Error in User Information. Please Log in Again",
            "data": None
        }
    user = User.select(id=a_response.id)[0]
    book = Book.select(isbn=a_response.isbn)[0]
    reviewList = Review.select(user_index=user.index, book_index=book.index)
    data = []
    for review in reviewList:
        review_content = load_json(review.file_path)
        data.append({
            'user_nickname': review_content['User'],
            'review': review_content['Review'],
            'comment': review_content['Comment']
        })
    return {
        "success": True,
        "message": "",
        "data": data
    }


@app.post('/api/logout',
          tags=['USER'],
          response_model=Model.ReturnResponseModel)
def logout(a_response: Model.LogoutModel):
    user = User.select(id=a_response.id)[0]
    token = generate_token()
    user.token = token
    user.update()
    return {
        "success": True,
        "message": "Logout Success",
        "data": None
    }


@app.post('/api/login',
          tags=['USER'],
          response_model=Model.ReturnResponseModel)
def login(a_response: Model.LoginModel):
    """
        사용자 Login API
        example
        requests.post('http://IP:PORT/api/login', json={'id': 'id', 'pwd': 'pwd'})
    """
    sLoginErrorResponse = {
        "success": False,
        "message": "Please Check Login Information",
        "data": None
    }
    try:
        user = User.select(id=a_response.id)[0]
        if user.pwd == string_encoding(a_response.pwd):
            token = generate_token()
            user.token = token
            user.update()
            return {
                "success": True,
                "message": "Login Success",
                "data": {
                    "token": token,
                    "nickname": user.nickname
                }
            }
        else:
            raise ValueError

    except (IndexError, ValueError):
        return sLoginErrorResponse


@app.post('/api/register',
          tags=['USER'],
          response_model=Model.ReturnResponseModel)
def register(a_response: Model.RegisterModel):
    """
    사용자 등록 API
    example
    requests.post('http://IP:PORT/api/register', json={'id': 'id', 'pwd': 'pwd', 'nickname': 'nick'})
    """
    if len(User.select(id=a_response.id, nickname=a_response.nickname)) > 0:
        return {
            "success": False,
            "message": "Exist User Try To Login or Another Information",
            "data": None
        }
    new_user_index = User.get_index()
    token = generate_token()
    user = User(new_user_index, a_response.id, string_encoding(a_response.pwd), token, a_response.nickname, 0, 0)
    user.insert()

    return {
        "success": True,
        "message": "Create User Check Data",
        "data": token
    }


if __name__ == '__main__':
    uvicorn.run(f'main:app', port=8080, host="0.0.0.0", reload=True)