import sqlite3
import json
from abc import ABCMeta, abstractmethod
import src.util.constant as const
from src.util.io_util import load_json


class SqliteAdapter:
    db_path = const.G_DB_FILE_PATH

    @classmethod
    def create(cls, a_create_query):
        with sqlite3.connect(cls.db_path, timeout=const.G_DB_TIMEOUT_SEC) as db:
            cursor = db.cursor()
            cursor.execute(a_create_query)
            db.commit()

    @classmethod
    def select(cls, a_select_query):
        with sqlite3.connect(cls.db_path, timeout=const.G_DB_TIMEOUT_SEC) as db:
            cursor = db.cursor()
            cursor.execute(a_select_query)
            data = cursor.fetchall()
            db.commit()
        return data

    @classmethod
    def insert(cls, a_select_query, a_parameters):
        with sqlite3.connect(cls.db_path, timeout=const.G_DB_TIMEOUT_SEC) as db:
            cursor = db.cursor()
            cursor.execute(a_select_query, a_parameters)
            db.commit()

    @classmethod
    def update(cls, a_select_query, a_parameters=None):
        with sqlite3.connect(cls.db_path, timeout=const.G_DB_TIMEOUT_SEC) as db:
            cursor = db.cursor()
            cursor.execute(a_select_query, a_parameters)
            db.commit()

    @classmethod
    def delete(cls, a_select_query, a_parameters=None):
        with sqlite3.connect(cls.db_path, timeout=const.G_DB_TIMEOUT_SEC) as db:
            cursor = db.cursor()
            cursor.execute(a_select_query, a_parameters)
            db.commit()


class DataBaseModel(metaclass=ABCMeta):
    schema_path: str = ""
    schema = load_json(schema_path)
    db_adapter = SqliteAdapter()

    def __repr__(self):
        return str(vars(self))

    def __init__(self, *args, **kwargs):
        pass

    @classmethod
    def create_table(cls):
        query = f"CREATE TABLE IF NOT EXISTS {cls.schema['name']}"
        schema_param = [*[f'{col_name} {col_schema}' for col_name, col_schema in cls.schema['schema'].items()], *cls.schema['relation']]

        schema_query = ', '.join(schema_param)
        query = f'{query} ( {schema_query} );'
        cls.db_adapter.create(query)

    @classmethod
    def select(cls, **kwargs):
        col_list = ', '.join(list(cls.schema['schema'].keys()))
        where_query = []
        for col_name, col_param in kwargs.items():
            if col_param is not None:
                where_query.append(f"{cls.schema['invert_map'][col_name]}={col_param}")
        if len(where_query) == 0:
            raise ValueError("전체 선택은 지원하지 않습니다.")
        where_query = ' AND '.join(where_query)
        query = f"SELECT {col_list} FROM {cls.schema['name']} WHERE {where_query}"
        return [cls.from_row(row) for row in cls.db_adapter.select(query)]

    def insert(self):
        values = tuple(getattr(self, prop_name) for prop_name in self.schema['map'].values())
        question = ','.join(['?']*len(self.schema['map']))
        query = f"INSERT INTO {self.schema['name']}({','.join(self.schema['map'].keys())}) VALUES({question})"
        self.db_adapter.insert(query, values)

    def update(self):
        pass

    @classmethod
    def from_row(cls, a_row):
        return cls(*a_row)


class User(DataBaseModel):
    schema_path = const.G_USER_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_id, a_pwd, a_nickname, a_is_delete):
        self.index = a_index
        self.id = a_id
        self.pwd = a_pwd
        self.nickname = a_nickname
        self.is_delete = a_is_delete
        super().__init__()

    @classmethod
    def select(cls, index=None, id=None, pwd=None, nickname=None, is_delete=None):
        return super().select(index=index, id=id, pwd=pwd, nickname=nickname, is_delete=is_delete)


class Book(DataBaseModel):
    schema_path = const.G_BOOK_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_title, a_author, a_publisher, a_category, a_isbn, a_is_delete):
        self.index = a_index
        self.title = a_title
        self.author = a_author
        self.publisher = a_publisher
        self.category = a_category
        self.isbn = a_isbn
        self.is_delete = a_is_delete
        super().__init__()


class AppliedBook(DataBaseModel):
    schema_path = const.G_APPLIED_BOOK_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_user_index, a_book_index, a_start_date, a_finish_date, a_rate, a_status, a_is_delete):
        self.index = a_index
        self.user_index = a_user_index
        self.book_index = a_book_index
        self.start_date = a_start_date
        self.finish_date = a_finish_date
        self.rate = a_rate
        self.status = a_status
        self.is_delete = a_is_delete
        super().__init__()


class Review(DataBaseModel):
    schema_path = const.G_REVIEW_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_user_index, a_book_index, a_file_path, a_range, a_is_delete):
        self.index = a_index
        self.user_index = a_user_index
        self.book_index = a_book_index
        self.file_path = a_file_path
        self.range = a_range
        self.is_delete = a_is_delete
        super().__init__()


if __name__ == '__main__':
    # print(User.create_table())
    # print(Book.create_table())
    # print(AppliedBook.create_table())
    # print(Review.create_table())
    # user1 = User(0, 'id', 'pwd', 'nick', 0)
    # user2 = User(1, 'id1', 'pwd', 'nick', 0)
    # user3 = User(2, 'id2', 'pwd', 'nick', 0)
    # user4 = User(3, 'id3', 'pwd', 'nick', 0)
    # user1.insert()
    # user2.insert()
    # user3.insert()
    # user4.insert()
    print(User.select(is_delete=0))