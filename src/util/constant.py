import os

G_PROJECT_BASE_DIR = r'C:\Users\HY\Desktop\bookrecorder'
G_SRC_DIR_PATH = os.path.join(G_PROJECT_BASE_DIR, 'src')
G_DATA_DIR_PATH = os.path.join(G_SRC_DIR_PATH, 'data')
G_DATA_DB_DIR_PATH = os.path.join(G_DATA_DIR_PATH, 'db')

G_DATA_REVIEW_DIR_PATH = os.path.join(G_DATA_DIR_PATH, 'review')

# DB CONSTANT
G_DB_FILE_PATH = os.path.join(G_DATA_DB_DIR_PATH, 'bookreader.db')
G_DB_TIMEOUT_SEC = 30

G_CFG_DIR_PATH = os.path.join(G_SRC_DIR_PATH, 'cfg')
G_TABLE_CFG_DIR_PATH = os.path.join(G_CFG_DIR_PATH, 'table')

G_USER_TABLE_SCHEMA_FILE_PATH = os.path.join(G_TABLE_CFG_DIR_PATH, 'user.json')
G_BOOK_TABLE_SCHEMA_FILE_PATH = os.path.join(G_TABLE_CFG_DIR_PATH, 'book.json')
G_APPLIED_BOOK_TABLE_SCHEMA_FILE_PATH = os.path.join(G_TABLE_CFG_DIR_PATH, 'appliedBook.json')
G_REVIEW_TABLE_SCHEMA_FILE_PATH = os.path.join(G_TABLE_CFG_DIR_PATH, 'review.json')

# BOOK SEARCH API

G_BOOK_CATEGORY_TAG = 'a:bok.category,r:1'

G_NAVER_API_CLIENT_ID = open(os.path.join(G_CFG_DIR_PATH,'apikey.txt')).readlines()[0].strip()  # 개발자센터에서 발급받은 Client ID 값
G_NAVER_API_SECRET_KEY = open(os.path.join(G_CFG_DIR_PATH,'apikey.txt')).readlines()[1].strip()  # 개발자센터에서 발급받은 Client Secret 값


# G_BOOK_STATUS

G_BOOK_STATUS_BEFORE = 10
G_BOOK_STATUS_INPROCESS = 20
G_BOOK_STATUS_FINISH = 30