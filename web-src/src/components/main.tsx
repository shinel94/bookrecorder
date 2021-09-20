import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { User } from "./user/user";
import { BookInfo } from "./user/bookInfo";

type MainState = {};

interface MainProps extends RouteComponentProps {
    userId: string;
    userNickname: string;
    userToken: string;
    logoutHandler: () => void;
}

export class Main extends React.Component<MainProps, MainState> {
    state: MainState = {};
    constructor(props: MainProps) {
        super(props);
        if (this.props.userToken.length === 0) {
            this.props.history.push("/");
        }
    }

    logoutHandler() {
        this.props.logoutHandler();
        this.props.history.push("/");
    }
    render() {
        return (
            <Container>
                <Box sx={{ bgcolor: "#bdb2ff", height: "100vh" }}>
                    <Grid container spacing={2} style={{ height: "100%" }}>
                        <Grid item xs={3} style={{ border: "1px solid white" }}>
                            <User
                                userNickname={this.props.userNickname}
                                logoutHandler={this.logoutHandler.bind(this)}
                            />
                            <Divider />
                            <BookInfo
                                userId={this.props.userId}
                                userToken={this.props.userToken}
                            />
                            <Divider />
                            Buttons
                        </Grid>
                        <Grid item xs={12} sm container>
                            BookInfo
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        );
    }
}
