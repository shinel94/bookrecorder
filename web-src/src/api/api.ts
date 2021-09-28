import axios from "axios";
import {
    BookInfoModel,
    SearchedBookModel,
    G_SERVER_URL,
    BookReviewModel,
    PostReviewModel,
} from "../utils/constant";

export class ApiAdapter {
    static p_server_url: string = G_SERVER_URL;
    static p_axios = axios.create({
        // baseURL: process.env.VUE_APP_BASE_URL
        baseURL: this.p_server_url,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });

    static async sendPostRequest<RequestType>(
        a_url: string,
        a_data: RequestType
    ) {
        return this.p_axios.post(a_url, a_data);
    }

    static async sendRegisterRequest(
        a_id: string,
        a_pwd: string,
        a_nick: string
    ): Promise<boolean> {
        let a_result: boolean = false;
        await this.sendPostRequest<{
            id: string;
            pwd: string;
            nickname: string;
        }>("/api/register", { id: a_id, pwd: a_pwd, nickname: a_nick })
            .then((a_reponse) => {
                a_result = true;
            })
            .catch((a_error) => {
                a_result = false;
            });
        return a_result;
    }

    static async sendLoginRequest(
        a_id: string,
        a_pwd: string
    ): Promise<{ token: string; nickname: string }> {
        let a_result: { token: string; nickname: string } = {
            token: "",
            nickname: "",
        };
        await this.sendPostRequest<{
            id: string;
            pwd: string;
        }>("/api/login", { id: a_id, pwd: a_pwd })
            .then((a_response) => {
                a_result.token = a_response.data.data.token;
                a_result.nickname = a_response.data.data.nickname;
            })
            .catch((a_error) => {
                console.log(a_error);
            });
        return a_result;
    }

    static async sendLogoutRequest(a_id: string): Promise<void> {
        await this.sendPostRequest<{
            id: string;
        }>("/api/logout", { id: a_id });
    }

    static async sendGetBookListRequest(
        a_id: string,
        a_token: string
    ): Promise<BookInfoModel[]> {
        const fetch_result: BookInfoModel[] = [];
        await this.sendPostRequest<{ id: string; token: string }>(
            "/api/book/list",
            { id: a_id, token: a_token }
        )
            .then((a_response) => {
                fetch_result.push(...a_response.data.data);
            })
            .catch((a_error) => {
                console.log(a_error);
            });
        return fetch_result;
    }

    static async sendSearchBookRequest(
        a_id: string,
        a_token: string,
        a_keyword: string
    ): Promise<SearchedBookModel[]> {
        const fetch_result: SearchedBookModel[] = [];
        await this.sendPostRequest<{
            id: string;
            token: string;
            keyword: string;
        }>("/api/book/search", { id: a_id, token: a_token, keyword: a_keyword })
            .then((a_response) => {
                fetch_result.push(...a_response.data.data);
            })
            .catch((a_error) => {
                console.log(a_error);
            });
        return fetch_result;
    }

    static async sendApplyBookRequest(
        a_id: string,
        a_token: string,
        a_title: string,
        a_author: string,
        a_publisher: string,
        a_category: string,
        a_isbn: string,
        a_thumbnail: string
    ): Promise<void> {
        await this.sendPostRequest<{
            id: string;
            token: string;
            title: string;
            author: string;
            publisher: string;
            category: string;
            isbn: string;
            thumbnail: string;
        }>("/api/book/apply", {
            id: a_id,
            token: a_token,
            title: a_title,
            author: a_author,
            publisher: a_publisher,
            category: a_category,
            isbn: a_isbn,
            thumbnail: a_thumbnail,
        })
            .then()
            .catch((a_error) => {
                console.log(a_error);
            });
    }

    static async sendGetReview(
        a_id: string,
        a_token: string,
        a_isbn: string
    ): Promise<BookReviewModel[]> {
        const fetch_result: BookReviewModel[] = [];
        await this.sendPostRequest<{
            id: string;
            token: string;
            isbn: string;
        }>("/api/review/search", { id: a_id, token: a_token, isbn: a_isbn })
            .then((a_response) => {
                fetch_result.push(...a_response.data.data);
            })
            .catch((a_error) => {
                console.log(a_error);
            });
        return fetch_result;
    }

    static async sendUpdateBookInfo(
        a_id: string,
        a_token: string,
        a_isbn: string,
        a_start_date: string | null,
        a_finish_date: string | null,
        a_status: number | null,
        a_rate: number | null
    ): Promise<void> {
        await this.sendPostRequest<{
            id: string;
            token: string;
            isbn: string;
            start_date: string | null;
            finish_date: string | null;
            status: number | null;
            rate: number | null;
        }>("/api/book/info/update", {
            id: a_id,
            token: a_token,
            isbn: a_isbn,
            start_date: a_start_date,
            finish_date: a_finish_date,
            status: a_status,
            rate: a_rate,
        })
            .then()
            .catch((a_error) => {
                console.log(a_error);
            });
    }

    static async sendPostReview(
        a_id: string,
        a_token: string,
        a_review_info: PostReviewModel
    ): Promise<void> {
        await this.sendPostRequest<{
            id: string;
            token: string;
            isbn: string;
            review: string;
            score: {
                interest: number;
                readability: number;
                quantity: number;
                total: number;
            };
            range: number;
        }>("/api/review/post", {
            id: a_id,
            token: a_token,
            isbn: a_review_info.isbn,
            review: a_review_info.review,
            score: a_review_info.score,
            range: a_review_info.range,
        })
            .then()
            .catch((a_error) => {
                console.log(a_error);
            });
    }
}
