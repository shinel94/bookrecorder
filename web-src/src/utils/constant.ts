export const G_SERVER_URL: string = "http://127.0.0.1:8080";

export interface BookInfoModel {
    title: string;
    author: string;
    category: string;
    image: string;
    start_date: string;
    finish_date: string;
    status: string;
    rate: string;
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
