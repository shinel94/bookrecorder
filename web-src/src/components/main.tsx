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
import {
    BookInfoModel,
    SearchedBookModel,
    PostReviewModel,
} from "../utils/constant";
import { Book } from "./book/book";
import { SelectBook } from "./user/selectBook";

type MainState = {
    isShowRegisterModal: boolean;
    readBookList: BookInfoModel[];
    isReadOnly: boolean;
    selectedBook: BookInfoModel | undefined;
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
        isReadOnly: false,
        readBookList: [],
        selectedBook: undefined,
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

    reviewPostHandler = async (reviewInfo: PostReviewModel) => {
        await ApiAdapter.sendPostReview(
            this.props.userId,
            this.props.userToken,
            reviewInfo
        );
    };

    reviewDeleteHandler = async (isbn: number) => {
        await ApiAdapter.sendDeleteReview(
            this.props.userId,
            this.props.userToken,
            isbn
        );
    };

    postCommentHandler = async (comment: string, review_index: string) => {
        await ApiAdapter.sendPostComment(
            this.props.userId,
            this.props.userToken,
            review_index,
            comment
        );
    };

    deleteCommentHandler = async (review_index: string) => {
        await ApiAdapter.sendDeleteComment(
            this.props.userId,
            this.props.userToken,
            review_index
        );
    };

    addBookHandler = async (book: SearchedBookModel) => {
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
        this.fetchBookList();
    };

    componentDidMount() {
        this.fetchBookList();
    }

    setIsReadOnly = (value: boolean) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isReadOnly: value,
                selectedBook: undefined,
            };
        });
    };

    bookClickListner = (aBookInfo: BookInfoModel) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                selectedBook: aBookInfo,
            };
        });
    };

    renderingBookInfoComponent = () => {
        if (typeof this.state.selectedBook === "undefined") {
            var aBookList = this.state.readBookList;
            if (this.state.isReadOnly) {
                aBookList = aBookList.filter(
                    (data) => data.finish_date === null
                );
            }
            return aBookList.map((aBookInfo, index) => {
                return (
                    <Book
                        index={index}
                        key={aBookInfo.isbn}
                        title={aBookInfo.title}
                        author={aBookInfo.author}
                        category={aBookInfo.category}
                        image={aBookInfo.image}
                        onClickHandler={() => {
                            this.bookClickListner(aBookInfo);
                        }}
                        cursor="pointer"
                        startDate={aBookInfo.start_date}
                        finishDate={aBookInfo.finish_date}
                        status={aBookInfo.status}
                        rate={aBookInfo.rate}
                        ratingReadOnly={true}
                        onRatingChangeHandler={(a: number) => {}}
                    ></Book>
                );
            });
        } else {
            return (
                <SelectBook
                    userId={this.props.userId}
                    userToken={this.props.userToken}
                    userNickname={this.props.userNickname}
                    selectBook={this.state.selectedBook}
                    statusUpdateHandler={this.selectBookStatusUpdate.bind(this)}
                    ratingUpdateHandler={this.selectBookRateUpdate.bind(this)}
                    reviewPostHandler={this.reviewPostHandler.bind(this)}
                    reviewDeleteHandler={this.reviewDeleteHandler.bind(this)}
                    postCommentHandler={this.postCommentHandler.bind(this)}
                    deleteCommentHandler={this.deleteCommentHandler.bind(this)}
                />
            );
        }
    };

    async selectBookStatusUpdate() {
        if (this.state.selectedBook) {
            const selectBook: BookInfoModel = this.state.selectedBook;
            if (selectBook.status === 0) {
                selectBook.status = 1;
                selectBook.finish_date = new Date()
                    .toISOString()
                    .split(".")[0]
                    .replace("T", " ");
            } else {
                selectBook.status = 0;
                selectBook.finish_date = null;
            }
            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectBook: selectBook,
                };
            });
            await ApiAdapter.sendUpdateBookInfo(
                this.props.userId,
                this.props.userToken,
                selectBook.isbn,
                selectBook.start_date,
                selectBook.finish_date,
                selectBook.status,
                selectBook.rate
            );
            this.fetchBookList();
        }
    }

    async selectBookRateUpdate(rate: number) {
        if (this.state.selectedBook) {
            const selectBook: BookInfoModel = this.state.selectedBook;
            selectBook.rate = Math.floor(rate);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    selectBook: selectBook,
                };
            });
            await ApiAdapter.sendUpdateBookInfo(
                this.props.userId,
                this.props.userToken,
                selectBook.isbn,
                selectBook.start_date,
                selectBook.finish_date,
                selectBook.status,
                selectBook.rate
            );
            this.fetchBookList();
        }
    }

    fetchBookList() {
        ApiAdapter.sendGetBookListRequest(
            this.props.userId,
            this.props.userToken
        ).then((aBookList) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    readBookList: aBookList,
                };
            });
        });
    }
    render() {
        const bookInfoComponent = this.renderingBookInfoComponent();

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
                                clickListner={this.setIsReadOnly.bind(this)}
                                totalBookNumber={this.state.readBookList.length}
                                readBookNumber={
                                    this.state.readBookList.filter(
                                        (data) => data.status === 0
                                    ).length
                                }
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
                            <Box
                                style={{
                                    margin: "3%",
                                    height: "95vh",
                                    overflow: "scroll",
                                }}
                            >
                                {bookInfoComponent}
                            </Box>
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
