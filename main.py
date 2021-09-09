from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn
import src.model.responseModel as Model
from src.model.dbModel import User, Book, Review, AppliedBook
from src.util.security import generate_token, string_encoding
from src.util.book_search_api import search_book_by_keyword

app = FastAPI()


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
    user = User.select(id=a_response.id)[0]
    if user.token != a_response.token:
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