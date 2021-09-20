import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Register } from "./modal/register";
import { ApiAdapter } from "../api/api";

type LoginState = {
    user_id: string;
    user_pwd: string;
    isShowRegisterModal: boolean;
};

interface LoginProps extends RouteComponentProps {
    setUserId: Function;
    setUserToekn: Function;
    setUserNcikname: Function;
}

const InputStyle = {
    marginLeft: "30%",
    marginRight: "30%",
    marginTop: "5%",
};

export class Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        user_id: "",
        user_pwd: "",
        isShowRegisterModal: false,
    };

    updateIdHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => ({
            ...prevState,
            user_id: event.target.value,
        }));
    };

    updatePwdHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => ({
            ...prevState,
            user_pwd: event.target.value,
        }));
    };

    loginEventHanlder = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const a_result = await ApiAdapter.sendLoginRequest(
            this.state.user_id,
            this.state.user_pwd
        );
        if (a_result.token.length === 0) {
            alert("Login Faile");
        } else {
            this.props.setUserId(this.state.user_id);
            this.props.setUserNcikname(a_result.nickname);
            this.props.setUserToekn(a_result.token);
        }
        this.props.history.push("main");
    };

    openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowRegisterModal: true,
            };
        });
    };

    closeModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowRegisterModal: false,
            };
        });
    };

    registerSubmitHandler = async (
        user_id: string,
        user_pwd: string,
        user_nickname: string
    ) => {
        let success = await ApiAdapter.sendRegisterRequest(
            user_id,
            user_pwd,
            user_nickname
        );
        if (success) {
            this.closeModal();
        } else {
            alert("Register Fail");
        }
    };

    render() {
        return (
            <div style={InputStyle}>
                <form>
                    <input
                        type="text"
                        value={this.state.user_id}
                        onChange={this.updateIdHandler}
                        placeholder={"User Id"}
                        style={{
                            width: "100%",
                            height: "30px",
                            marginTop: "10px",
                        }}
                    />
                    <input
                        type="password"
                        value={this.state.user_pwd}
                        onChange={this.updatePwdHandler}
                        placeholder={"User Password"}
                        style={{
                            width: "100%",
                            height: "30px",
                            marginTop: "10px",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                            width: "100%",
                        }}
                    >
                        <button
                            style={{ height: "30px" }}
                            onClick={this.loginEventHanlder}
                        >
                            Login
                        </button>
                        <button
                            style={{ height: "30px" }}
                            onClick={this.openModal}
                        >
                            Register
                        </button>
                    </div>
                </form>

                <Register
                    isModalOpen={this.state.isShowRegisterModal}
                    modalCloseHandler={this.closeModal}
                    submitHandler={this.registerSubmitHandler}
                />
            </div>
        );
    }
}
