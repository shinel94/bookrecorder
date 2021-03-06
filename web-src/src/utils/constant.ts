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

interface StringKeyStringValueHashTable {
    [key: string]: string;
}

interface NumberKeyStringValueHashTable {
    [key: number]: string;
}

export interface BookReviewModel {
    review_index: string;
    user_nickname: string;
    book_title: string;
    review: string;
    comment: StringKeyStringValueHashTable; // {id1: comment, id2: comment} 인 hash map이 반환
    score: {
        interest: number;
        readability: number;
        quantity: 1 | 2 | 3 | 4 | 5;
        total: number;
    };
}

export const StatusEnum: NumberKeyStringValueHashTable = {
    0: "읽는 중",
    1: "다 읽음",
};

export interface PostReviewModel {
    isbn: string;
    review: string;
    score: {
        interest: number;
        readability: number;
        quantity: 1 | 2 | 3 | 4 | 5;
        total: number;
    };
    range: number;
}

export const QuantityKeyValueMap: NumberKeyStringValueHashTable = {
    1: "많이 짧다",
    2: "조금 짧다",
    3: "적당하다",
    4: "조금 길다",
    5: "많이 길다",
};
