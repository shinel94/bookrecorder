from uuid import uuid4
import random
import hashlib
from src.model.dbModel import User


def string_encoding(a_string: str):
    return hashlib.sha256(a_string.encode('utf-8')).hexdigest()


def generate_token():
    idx = int(random.random() * 9) // 3 + 1
    return str(uuid4()).split('-')[0] + str(uuid4()).split('-')[idx] + str(uuid4()).split('-')[-1]


def check_token(id, token):
    user = User.select(id=id)[0]
    return user.token == token
