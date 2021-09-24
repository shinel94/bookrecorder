import React from "react";
// import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type UserState = {};

interface UserProps {
    userNickname: string;
    logoutHandler: () => void;
}

export class User extends React.Component<UserProps, UserState> {
    state: UserState = {};
    render() {
        return (
            <Stack style={{ margin: "10px" }}>
                <h3 style={{ textAlign: "center" }}>
                    {this.props.userNickname}
                </h3>
                <Button
                    onClick={this.props.logoutHandler}
                    style={{
                        alignContent: "center",
                        display: "flex",
                        marginLeft: "33%",
                        marginRight: "33%",
                    }}
                >
                    <LogoutIcon />
                </Button>
            </Stack>
        );
    }
}
