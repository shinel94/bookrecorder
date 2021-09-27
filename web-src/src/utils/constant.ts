export const G_SERVER_URL: string = "http://127.0.0.1:8080";

export interface BookInfoModel {
    title: string;
    author: string;
    isbn: string;
    category: string;
    image: string;
    start_date: string;
    finish_date: string | null;
    status: number;
    rate: number;
}

export interface SearchedBookModel {
    author: string;
    category: string;
    description: string;
    discount: string;
    image: string;
    isbn: string;
    link: string;
    price: string;
    pubdate: string;
    publisher: string;
    title: string;
}

export interface BookReviewModel {
    review_index: string;
    user_nickname: string;
    book_title: string;
    review: string;
    comment: any; // {id1: comment, id2: comment} 인 hash map이 반환
    score: {
        interest: number;
        readability: number;
        quantity: number;
        total: number;
    };
}

interface StringKeyValueObject {
    [key: number]: string;
}
export const StatusEnum: StringKeyValueObject = {
    0: "읽는 중",
    1: "다 읽음",
};
