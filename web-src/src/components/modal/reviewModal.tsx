import React from "react";
import Modal from "@mui/material/Modal";
import { BookCard } from "../book/bookCard";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { BookInfoModel, PostReviewModel } from "../../utils/constant";
import { Rating, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import Slider from "@mui/material/Slider";

const theme = createTheme({
    palette: {
        primary: green,
        secondary: {
            main: "#b9f6ca",
        },
    },
});

type ReviewModalState = {
    review: string;
    totalRating: number;
    quantity: number;
    interest: number;
    readability: number;
};

type ReviewModalProps = {
    isModalOpen: boolean;
    modalCloseHandler: () => void;
    selectBook: BookInfoModel;
    postHandler: (arg0: PostReviewModel) => void;
    fetchReviewHandler: () => void;
};

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "1px solid #bdb2ff",
    boxShadow: 12,
    p: 4,
    fontFamily: "KCC",
};
const inputStyle = {
    margin: "5px",
    width: "80%",
    fontFamily: "KCC",
    fontSize: "0.5rem",
};

export class ReviewModal extends React.Component<
    ReviewModalProps,
    ReviewModalState
> {
    state: ReviewModalState = {
        review: "",
        totalRating: 5,
        quantity: 3,
        interest: 5,
        readability: 5,
    };

    reviewChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                review: event.target.value,
            };
        });
    };

    reviewPostHandler = async (_: number) => {
        await this.props.postHandler({
            isbn: this.props.selectBook.isbn,
            review: this.state.review,
            score: {
                interest: this.state.interest,
                readability: this.state.readability,
                quantity: this.state.quantity,
                total: this.state.totalRating,
            },
            range: 0,
        });
        this.props.fetchReviewHandler();
        this.props.modalCloseHandler();
    };
    render() {
        return (
            <Modal
                open={this.props.isModalOpen}
                onClose={this.props.modalCloseHandler}
                style={{ fontFamily: "KCC" }}
            >
                <Box sx={style}>
                    <div>
                        <BookCard
                            index={0}
                            title={this.props.selectBook.title}
                            author={this.props.selectBook.author}
                            category={this.props.selectBook.category}
                            image={this.props.selectBook.image}
                            publisher={""}
                            clickListener={this.reviewPostHandler}
                            buttonText="Post"
                        ></BookCard>
                    </div>
                    <Divider />
                    <Paper style={{ marginTop: "10px" }}>
                        <InputLabel
                            htmlFor="filled-adornment-password"
                            style={{ fontFamily: "KCC" }}
                        >
                            흥미 / 재미
                        </InputLabel>
                        <Slider
                            aria-label="Default"
                            value={this.state.interest}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={(event, newValue) => {
                                console.log(newValue);
                                var interst = 3;
                                if (newValue) {
                                    if (Array.isArray(newValue)) {
                                        interst = newValue[0];
                                    } else {
                                        interst = newValue;
                                    }
                                    this.setState((prevState) => {
                                        return {
                                            ...prevState,
                                            interest: interst,
                                        };
                                    });
                                }
                            }}
                        />

                        <InputLabel
                            htmlFor="filled-adornment-password"
                            style={{ fontFamily: "KCC" }}
                        >
                            가독성
                        </InputLabel>
                        <Slider
                            aria-label="Default"
                            value={this.state.readability}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            onChange={(event, newValue) => {
                                console.log(newValue);
                                var readability = 3;
                                if (newValue) {
                                    if (Array.isArray(newValue)) {
                                        readability = newValue[0];
                                    } else {
                                        readability = newValue;
                                    }
                                    this.setState((prevState) => {
                                        return {
                                            ...prevState,
                                            readability: readability,
                                        };
                                    });
                                }
                            }}
                        />
                        <InputLabel
                            htmlFor="filled-adornment-password"
                            style={{ fontFamily: "KCC" }}
                        >
                            분량
                        </InputLabel>
                        <ThemeProvider theme={theme}>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    color={
                                        this.state.quantity === 1
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => {
                                        this.setState((prevState) => {
                                            return {
                                                ...prevState,
                                                quantity: 1,
                                            };
                                        });
                                    }}
                                >
                                    많이 짧다
                                </Button>
                                <Button
                                    color={
                                        this.state.quantity === 2
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => {
                                        this.setState((prevState) => {
                                            return {
                                                ...prevState,
                                                quantity: 2,
                                            };
                                        });
                                    }}
                                >
                                    조금 짧다
                                </Button>
                                <Button
                                    color={
                                        this.state.quantity === 3
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => {
                                        this.setState((prevState) => {
                                            return {
                                                ...prevState,
                                                quantity: 3,
                                            };
                                        });
                                    }}
                                >
                                    적당했다
                                </Button>
                                <Button
                                    color={
                                        this.state.quantity === 4
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => {
                                        this.setState((prevState) => {
                                            return {
                                                ...prevState,
                                                quantity: 4,
                                            };
                                        });
                                    }}
                                >
                                    조금 길다
                                </Button>
                                <Button
                                    color={
                                        this.state.quantity === 5
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => {
                                        this.setState((prevState) => {
                                            return {
                                                ...prevState,
                                                quantity: 5,
                                            };
                                        });
                                    }}
                                >
                                    많이 길다
                                </Button>
                            </Box>
                        </ThemeProvider>
                        <InputLabel
                            htmlFor="filled-adornment-password"
                            style={{ fontFamily: "KCC" }}
                        >
                            총평
                        </InputLabel>
                        <Rating
                            name="totalRating"
                            value={this.state.totalRating / 2}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    this.setState((prevState) => {
                                        return {
                                            ...prevState,
                                            totalRating: Math.floor(
                                                newValue * 2
                                            ),
                                        };
                                    });
                                }
                            }}
                        />

                        <InputLabel
                            htmlFor="filled-adornment-password"
                            style={{ fontFamily: "KCC" }}
                        >
                            Review
                        </InputLabel>
                        <TextField
                            id="user-id-input"
                            value={this.state.review}
                            onChange={this.reviewChangeHandler}
                            style={inputStyle}
                            label="Multiline"
                            multiline
                            maxRows={4}
                        />
                    </Paper>
                </Box>
            </Modal>
        );
    }
}
