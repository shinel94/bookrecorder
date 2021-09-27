import React from "react";
import { BookInfoModel, BookReviewModel } from "../../utils/constant";
import { ApiAdapter } from "../../api/api";
import { Book } from "../book/book";
import { Divider } from "@mui/material";
import Container from "@mui/material/Container";
import { Review } from "../book/review";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

type SelectBookState = {
    reviewList: BookReviewModel[];
};

interface SelectBookProps {
    userId: string;
    userToken: string;
    selectBook: BookInfoModel;
    statusUpdateHandler: () => void;
}

export class SelectBook extends React.Component<
    SelectBookProps,
    SelectBookState
> {
    state: SelectBookState = {
        reviewList: [],
    };

    componentDidMount() {
        ApiAdapter.sendGetReview(
            this.props.userId,
            this.props.userToken,
            this.props.selectBook.isbn
        )
            .then((reviewList) => {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        reviewList: reviewList,
                    };
                });
            })
            .catch((error) => console.log(error));
    }

    render() {
        // const review = this.state.reviewList.map((_) => {
        //     return <Review />;
        // });
        const review = [1, 2, 3].map((_) => {
            return <Review />;
        });
        return (
            <Container
                style={{
                    width: "800px",
                    marginLeft: 0,
                }}
            >
                <Box
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Button
                        color="secondary"
                        onClick={this.props.statusUpdateHandler}
                    >
                        {this.props.selectBook.status === 1 ? "재독" : "완독"}
                    </Button>
                    <Button color="secondary">리뷰</Button>
                </Box>

                <Book
                    index={0}
                    title={this.props.selectBook.title}
                    author={this.props.selectBook.author}
                    category={this.props.selectBook.category}
                    image={this.props.selectBook.image}
                    onClickHandler={() => {}}
                    cursor=""
                    startDate={this.props.selectBook.start_date}
                    finishDate={this.props.selectBook.finish_date}
                    status={this.props.selectBook.status}
                    rate={this.props.selectBook.rate}
                ></Book>
                <Divider style={{ margin: "5px" }} />
                {review}
            </Container>
        );
    }
}
