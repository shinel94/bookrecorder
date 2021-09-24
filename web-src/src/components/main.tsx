import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { User } from "./user/user";
import { BookInfo } from "./user/bookInfo";
import Button from "@mui/material/Button";
import { createTheme } from "@material-ui/core/styles";
import lime from "@material-ui/core/colors/lime";
import { ThemeProvider } from "@material-ui/styles";
import { Search } from "./modal/saerch";
import { ApiAdapter } from "../api/api";
import { SearchedBookModel } from "../utils/constant";

type MainState = {
    isShowRegisterModal: boolean;
};

interface MainProps extends RouteComponentProps {
    userId: string;
    userNickname: string;
    userToken: string;
    logoutHandler: () => void;
}

const theme = createTheme({
    palette: {
        primary: lime,
    },
});

export class Main extends React.Component<MainProps, MainState> {
    state: MainState = {
        isShowRegisterModal: false,
    };
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
    openSearchModal() {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowRegisterModal: true,
            };
        });
    }
    closeSearchModal() {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowRegisterModal: false,
            };
        });
    }
    searchHandler = async (keyword: string) => {
        const bookList: SearchedBookModel[] = [];
        await ApiAdapter.sendSearchBookRequest(
            this.props.userId,
            this.props.userToken,
            keyword
        ).then((aResponse) => bookList.push(...aResponse));
        return bookList;
    };

    addBookHandler = async (book: SearchedBookModel) => {
        console.log(book);
        ApiAdapter.sendApplyBookRequest(
            this.props.userId,
            this.props.userToken,
            book.title,
            book.author,
            book.publisher,
            book.category,
            book.isbn,
            book.image
        );
    };
    render() {
        return (
            <Container>
                <Box
                    sx={{
                        bgcolor: "#bdb2ff",
                        height: "100vh",
                        marginTop: "5%",
                    }}
                >
                    <Grid container spacing={2} style={{ height: "100%" }}>
                        <Grid
                            item
                            xs={3}
                            style={{ border: "0.5px solid white" }}
                        >
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
                            <ThemeProvider theme={theme}>
                                <div
                                    style={{
                                        justifyContent: "space-between",
                                        display: "flex",
                                    }}
                                >
                                    <Button
                                        onClick={this.openSearchModal.bind(
                                            this
                                        )}
                                        style={{
                                            margin: "10%",
                                            fontFamily: "KCC",
                                        }}
                                        color="inherit"
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        onClick={() => {}}
                                        style={{
                                            margin: "10%",
                                            fontFamily: "KCC",
                                        }}
                                        color="inherit"
                                    >
                                        Statics
                                    </Button>
                                </div>
                            </ThemeProvider>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm
                            container
                            style={{ border: "0.5px solid white" }}
                        >
                            BookInfo
                        </Grid>
                    </Grid>
                </Box>
                <Search
                    isModalOpen={this.state.isShowRegisterModal}
                    modalCloseHandler={this.closeSearchModal.bind(this)}
                    searchHandler={this.searchHandler.bind(this)}
                    addBookHandler={this.addBookHandler.bind(this)}
                ></Search>
            </Container>
        );
    }
}
