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
    def select(cls, a_select_query, a_select_parameter=None):
        with sqlite3.connect(cls.db_path, timeout=const.G_DB_TIMEOUT_SEC) as db:
            cursor = db.cursor()
            cursor.execute(a_select_query, a_select_parameter)
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
        return str({prop_name: getattr(self, prop_name) for prop_name in self.schema['map'].values()})

    def __init__(self, a_index, *args, **kwargs):
        self.index = a_index

    @classmethod
    def from_row(cls, a_row):
        return cls(*a_row)

    @classmethod
    def create_table(cls):
        query = f"CREATE TABLE IF NOT EXISTS {cls.schema['name']}"
        schema_param = [*[f'{col_name} {col_schema}' for col_name, col_schema in cls.schema['schema'].items()], *cls.schema['relation']]

        schema_query = ', '.join(schema_param)
        query = f'{query} ( {schema_query} );'
        cls.db_adapter.create(query)

    @classmethod
    def get_index(cls):
        query = f"SELECT SEQ FROM SQLITE_SEQUENCE WHERE NAME=?"
        return int(cls.db_adapter.select(query, [cls.schema['name']])[0][0]) + 1

    @classmethod
    def _select(cls, **kwargs):
        col_list = ', '.join(list(cls.schema['schema'].keys()))
        where_query = []
        values = []
        for col_name, col_param in kwargs.items():
            if col_param is not None:
                where_query.append(f"{cls.schema['invert_map'][col_name]}=?")
                values.append(col_param)
        if len(where_query) == 0:
            raise ValueError("전체 선택은 지원하지 않습니다.")
        where_query = ' AND '.join(where_query)
        query = f"SELECT {col_list} FROM {cls.schema['name']} WHERE {where_query}"
        return cls.db_adapter.select(query, values)

    def insert(self):
        values = tuple(getattr(self, prop_name) for prop_name in self.schema['map'].values())
        question = ','.join(['?']*len(self.schema['map']))
        query = f"INSERT INTO {self.schema['name']}({','.join(self.schema['map'].keys())}) VALUES({question})"
        self.db_adapter.insert(query, values)

    def _update(self, **kwargs):
        set_query = []
        values = []
        for col_name, col_param in kwargs.items():
            if col_param is not None:
                set_query.append(f"{self.schema['invert_map'][col_name]} = ?")
                values.append(col_param)
        if len(set_query) == 0:
            raise ValueError("변화된 프로퍼티가 존재하지 않습니다.")
        set_query = ', '.join(set_query)
        query = f"UPDATE {self.schema['name']} SET {set_query} WHERE {self.schema['name']}_INDEX = {self.index}"
        self.db_adapter.update(query, values)
        self.update_property()


    @abstractmethod
    def update_property(self):
        raise NotImplementedError

    def update(self):
        update_parameter_dict = {}
        for prop_name in self.schema['map'].values():
            try:
                if getattr(self, prop_name) != getattr(self, '_prev_' + prop_name):
                    update_parameter_dict[prop_name] = getattr(self, prop_name)
            except AttributeError:
                pass
        return self._update(**update_parameter_dict)

    @classmethod
    @abstractmethod
    def select(cls, *args, **kwargs):
        raise NotImplementedError


class User(DataBaseModel):
    schema_path = const.G_USER_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_id, a_pwd, a_token, a_nickname, a_read, a_is_delete):
        self.id = a_id
        self.pwd = a_pwd
        self.token = a_token
        self.nickname = a_nickname
        self.read = a_read
        self.is_delete = a_is_delete

        self._prev_id = self.id
        self._prev_pwd = self.pwd
        self._prev_token = self.token
        self._prev_nickname = self.nickname
        self._prev_read = self.read
        self._prev_is_delete = self.is_delete
        super().__init__(a_index)

    @classmethod
    def select(cls, index=None, id=None, pwd=None, nickname=None, read=None, is_delete=0):
        selected_row = cls._select(index=index, id=id, pwd=pwd, nickname=nickname, read=read, is_delete=is_delete)
        return [cls.from_row(row) for row in selected_row]

    def update_property(self):
        self._prev_id = self.id
        self._prev_pwd = self.pwd
        self._prev_token = self.token
        self._prev_nickname = self.nickname
        self._prev_read = self.read
        self._prev_is_delete = self.is_delete


class Book(DataBaseModel):
    schema_path = const.G_BOOK_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_title, a_author, a_publisher, a_category, a_isbn, a_thumbnail, a_read, a_is_delete):
        self.title = a_title
        self.author = a_author
        self.publisher = a_publisher
        self.category = a_category
        self.isbn = a_isbn
        self.thumbnail = a_thumbnail
        self.read = a_read
        self.is_delete = a_is_delete

        self._prev_title = self.title
        self._prev_author = self.author
        self._prev_publisher = self.publisher
        self._prev_category = self.category
        self._prev_thumbnail = self.thumbnail
        self._prev_isbn = self.isbn
        self._prev_read = self.read
        self._prev_is_delete = self.is_delete

        super().__init__(a_index)

    def update_property(self):
        self._prev_title = self.title
        self._prev_author = self.author
        self._prev_publisher = self.publisher
        self._prev_category = self.category
        self._prev_thumbnail = self.thumbnail
        self._prev_isbn = self.isbn
        self._prev_read = self.read
        self._prev_is_delete = self.is_delete

    @classmethod
    def select(cls, index=None, title=None, author=None, publisher=None, category=None, isbn=None, thumbnail=None, read=None, is_delete=0):
        selected_row = cls._select(
            index=index,
            title=title,
            author=author,
            publisher=publisher,
            category=category,
            isbn=isbn,
            thumbnail=thumbnail,
            read=read,
            is_delete=is_delete
        )
        return [cls.from_row(row) for row in selected_row]


class AppliedBook(DataBaseModel):
    schema_path = const.G_APPLIED_BOOK_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_user_index, a_book_index, a_start_date, a_finish_date, a_rate, a_status, a_is_delete):
        self.user_index = a_user_index
        self.book_index = a_book_index
        self.start_date = a_start_date
        self.finish_date = a_finish_date
        self.rate = a_rate
        self.status = a_status
        self.is_delete = a_is_delete

        self._prev_user_index = self.user_index
        self._prev_book_index = self.book_index
        self._prev_start_date = self.start_date
        self._prev_finish_date = self.finish_date
        self._prev_rate = self.rate
        self._prev_status = self.status
        self._prev_is_delete = self.is_delete

        super().__init__(a_index)

    def update_property(self):
        self._prev_user_index = self.user_index
        self._prev_book_index = self.book_index
        self._prev_start_date = self.start_date
        self._prev_finish_date = self.finish_date
        self._prev_rate = self.rate
        self._prev_status = self.status
        self._prev_is_delete = self.is_delete

    @classmethod
    def select(cls, index=None, user_index=None, book_index=None, start_date=None, finish_date=None, rate=None, status=None, is_delete=0):
        selected_row = cls._select(
            index=index,
            user_index=user_index,
            book_index=book_index,
            start_date=start_date,
            finish_date=finish_date,
            rate=rate,
            status=status,
            is_delete=is_delete
        )
        return [cls.from_row(row) for row in selected_row]


class Review(DataBaseModel):
    schema_path = const.G_REVIEW_TABLE_SCHEMA_FILE_PATH
    schema = load_json(schema_path)

    def __init__(self, a_index, a_user_index, a_book_index, a_file_path, a_range, a_is_delete):
        self.user_index = a_user_index
        self.book_index = a_book_index
        self.file_path = a_file_path
        self.range = a_range  # 0: 전체공개, 1: 나만보기
        self.is_delete = a_is_delete

        self._prev_user_index = self.user_index
        self._prev_book_index = self.book_index
        self._prev_file_path = self.file_path
        self._prev_range = self.range
        self._prev_is_delete = self.is_delete

        super().__init__(a_index)

    def update_property(self):
        self._prev_user_index = self.user_index
        self._prev_book_index = self.book_index
        self._prev_file_path = self.file_path
        self._prev_range = self.range
        self._prev_is_delete = self.is_delete

    @classmethod
    def select(cls, index=None, user_index=None, book_index=None, file_path=None, range=None, is_delete=0):
        selected_row = cls._select(
            index=index,
            user_index=user_index,
            book_index=book_index,
            file_path=file_path,
            range=range,
            is_delete=is_delete
        )
        return [cls.from_row(row) for row in selected_row]

if __name__ == '__main__':
    print(User.create_table())
    print(Book.create_table())
    print(AppliedBook.create_table())
    print(Review.create_table())
    user1 = User(0, 'id', 'pwd', "", 'nick', 0, 0)
    user2 = User(1, 'id1', 'pwd', "", 'nick', 0, 0)
    user3 = User(2, 'id2', 'pwd', "", 'nick', 0, 0)
    user4 = User(3, 'id3', 'pwd', "", 'nick', 0, 0)
    user1.insert()
    user2.insert()
    user3.insert()
    user4.insert()
    print(User.select(is_delete=0))
    print(User.select(id='id1'))
    user: User = User.select(index=0)[0]
    user.is_delete = 1
    user.update()
    print(User.select(index=0))

    book1 = Book(0, 'title', 'author', 'publisher', 'category', 1231231231, 'thumbnail_url', 1, 0)
    book2 = Book(1, 'title1', 'author1', 'publisher1', 'category1', 1231231232, 'thumbnail_url', 1, 0)
    book3 = Book(2, 'title2', 'author2', 'publisher2', 'category2', 1231231233, 'thumbnail_url', 1, 0)
    book1.insert()
    book2.insert()
    book3.insert()

    print(Book.select(read=1))

    ap_book = AppliedBook(0, 0, 0, '2021-09-08', None, 5, 1, 0)
    ap_book.insert()
    print(AppliedBook.select(rate=5))

    review = Review(0, 0, 0, 'test.json', 0, 0)
    review1 = Review(1, 0, 0, 'test1.json', 0, 0)
    review2 = Review(2, 0, 0, 'test2.json', 0, 0)

    review.insert()
    review1.insert()
    review2.insert()

    print(Review.select(range=0))

    print(User.get_index())
    print(Book.get_index())
    print(AppliedBook.get_index())
    print(Review.get_index())