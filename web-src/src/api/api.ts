import axios from "axios";
import { BookInfoModel, G_SERVER_URL } from "../utils/constant";

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
}
