import React from "react";
import { RouteComponentProps } from "react-router";
import { Register } from "./modal/register";

type LoginState = {
    user_id: string;
    user_pwd: string;
    isShowRegisterModal: boolean;
};

interface LoginProps extends RouteComponentProps {}

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
        this.setState(
            (prevState) => ({
                ...prevState,
                user_pwd: event.target.value,
            }),
            () => {
                console.log(this.state.user_pwd);
            }
        );
    };

    loginEventHanlder = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("login");
        event.preventDefault();
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

    registerSubmitHandler = (
        user_id: string,
        user_pwd: string,
        user_nickname: String
    ) => {
        console.log(user_id, user_pwd, user_nickname);
        this.closeModal();
    };

    render() {
        console.log(this.state.isShowRegisterModal);
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
