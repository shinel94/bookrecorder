from src.util.constant import G_DATA_REVIEW_DIR_PATH
from src.model.responseModel import ReviewScore
from src.util.string_util import get_date_string
from src.util.io_util import save_json, load_json
import os

class Review:
    def __init__(self, nickname, title, review, score: ReviewScore, comment=None):
        self.nickname = nickname
        self.title = title
        self.review = review
        self.score = score
        if comment is None:
            self.comment = {}
        else:
            self.comment = comment

    def save(self, file_name=None):
        data = {
            'User': self.nickname,
            'Book': self.title,
            'Review': self.review,
            'score': {
                "재미": self.score.interest,
                "가독성": self.score.readability,
                "분량": self.score.quantity,
                "전체평점": self.score.total
            },
            'Comment': self.comment
        }
        if file_name is None:
            token = get_date_string()
            token.replace('-', '').replace(':', '').replace(' ', '')
            file_name = f'{token}_{self.nickname}_{self.title}.json'
        save_json(os.path.join(G_DATA_REVIEW_DIR_PATH, file_name), data)
        return file_name

    @classmethod
    def load_from_json(cls, file_name):
        data = load_json(os.path.join(G_DATA_REVIEW_DIR_PATH, file_name))
        score = ReviewScore(interest=data['score']['재미'],
                            readability=data['score']['가독성'],
                            quantity=data['score']['분량'],
                            total=data['score']['전체평점']
                            )
        return cls(data['User'], data['Book'], data['Review'], score, data['Comment'])

    @staticmethod
    def delete(file_path):
        try:
            os.remove(os.path.join(G_DATA_REVIEW_DIR_PATH, file_path))
        except:
            pass
