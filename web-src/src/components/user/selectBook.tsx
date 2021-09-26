import React from "react";
import { BookInfoModel, BookReviewModel } from "../../utils/constant";
import { ApiAdapter } from "../../api/api";
import { Book } from "../book/book";
import { Divider } from "@mui/material";
import Container from "@mui/material/Container";
import { Review } from "../book/review";

type SelectBookState = {
    reviewList: BookReviewModel[];
};

interface SelectBookProps {
    userId: string;
    userToken: string;
    selectBook: BookInfoModel;
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
                }}
            >
                <Book
                    index={0}
                    title={this.props.selectBook.title}
                    author={this.props.selectBook.author}
                    category={this.props.selectBook.category}
                    image={this.props.selectBook.image}
                    onClickHandler={() => {}}
                    cursor=""
                ></Book>
                <Divider style={{ margin: "5px" }} />
                {review}
            </Container>
        );
    }
}
