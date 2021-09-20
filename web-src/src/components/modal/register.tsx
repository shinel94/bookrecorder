import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";

type RegisterState = {
    isShowPassword: boolean;
    password: string;
    id: string;
    nickname: string;
};

type RegisterProps = {
    isModalOpen: boolean;
    modalCloseHandler: () => void;
    submitHandler: (id: string, pwd: string, nick: string) => void;
};

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #bdb2ff",
    boxShadow: 12,
    p: 4,
};

const inputStyle = {
    margin: "10px",
    width: "100%",
};

export class Register extends React.Component<RegisterProps, RegisterState> {
    state: RegisterState = {
        isShowPassword: false,
        password: "",
        id: "",
        nickname: "",
    };

    idChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                id: event.target.value,
            };
        });
    };

    nicknameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                nickname: event.target.value,
            };
        });
    };

    passwordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                password: event.target.value,
            };
        });
    };

    mouseDownPasswordHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    showPasswordHandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowPassword: !prevState.isShowPassword,
            };
        });
    };

    render() {
        return (
            <Modal
                open={this.props.isModalOpen}
                onClose={this.props.modalCloseHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        style={{ marginBottom: "25px" }}
                    >
                        INFORMATION
                    </Typography>

                    <InputLabel htmlFor="filled-adornment-password">
                        ID
                    </InputLabel>
                    <OutlinedInput
                        id="user-id-input"
                        type="text"
                        value={this.state.id}
                        onChange={this.idChangeHandler}
                        label="Id"
                        style={inputStyle}
                    />

                    <InputLabel htmlFor="filled-adornment-password">
                        Password
                    </InputLabel>
                    <OutlinedInput
                        id="user-password-input"
                        type={this.state.isShowPassword ? "text" : "password"}
                        value={this.state.password}
                        onChange={this.passwordChangeHandler}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={this.showPasswordHandler}
                                    onMouseDown={this.mouseDownPasswordHandler}
                                    edge="end"
                                >
                                    {this.state.isShowPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        style={inputStyle}
                    />

                    <InputLabel htmlFor="filled-adornment-password">
                        NickName
                    </InputLabel>
                    <OutlinedInput
                        id="user-nickname-input"
                        type="text"
                        value={this.state.nickname}
                        onChange={this.nicknameChangeHandler}
                        label="NickName"
                        style={inputStyle}
                    />
                    <Divider light />
                    <Button
                        variant="text"
                        onClick={() => {
                            this.props.submitHandler(
                                this.state.id,
                                this.state.password,
                                this.state.nickname
                            );
                        }}
                        size="large"
                        style={{ float: "right" }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        );
    }
}
