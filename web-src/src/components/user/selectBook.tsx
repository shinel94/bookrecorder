import React from "react";
import {
    BookInfoModel,
    BookReviewModel,
    PostReviewModel,
} from "../../utils/constant";
import { ApiAdapter } from "../../api/api";
import { Book } from "../book/book";
import { Divider } from "@mui/material";
import Container from "@mui/material/Container";
import { Review } from "../book/review";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { ReviewModal } from "../modal/reviewModal";
import Card from "@mui/material/Card";

type SelectBookState = {
    reviewList: BookReviewModel[];
    isReviewModalOpen: boolean;
};

interface SelectBookProps {
    userId: string;
    userToken: string;
    userNickname: string;
    selectBook: BookInfoModel;
    statusUpdateHandler: () => void;
    ratingUpdateHandler: (rate: number) => void;
    reviewPostHandler: (arg0: PostReviewModel) => void;
    reviewDeleteHandler: (isbn: number) => void;
    postCommentHandler: (comment: string, review_index: string) => void;
    deleteCommentHandler: (review_index: string) => void;
}

export class SelectBook extends React.Component<
    SelectBookProps,
    SelectBookState
> {
    state: SelectBookState = {
        reviewList: [],
        isReviewModalOpen: false,
    };

    openReviewModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isReviewModalOpen: true,
            };
        });
    };

    closeReviewModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isReviewModalOpen: false,
            };
        });
    };
    fetchReviewList = () => {
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
    };
    componentDidMount() {
        this.fetchReviewList();
    }

    render() {
        const review = this.state.reviewList.map((aReviewData) => {
            return (
                <Review
                    key={aReviewData.review_index}
                    ReviewData={aReviewData}
                    clickUserNickName={this.props.userNickname}
                    deleteReviewHandler={this.props.reviewDeleteHandler}
                    postCommentHandler={this.props.postCommentHandler}
                    fetchReviwe={this.fetchReviewList.bind(this)}
                    clickUserId={this.props.userId}
                    deleteCommentHandler={this.props.deleteCommentHandler}
                />
            );
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
                        size="large"
                    >
                        {this.props.selectBook.status === 1
                            ? "또 읽기"
                            : "완독"}
                    </Button>
                    <Button
                        color="secondary"
                        onClick={this.openReviewModal}
                        disabled={
                            typeof this.state.reviewList.find((review) => {
                                return (
                                    review.user_nickname ===
                                    this.props.userNickname
                                );
                            }) !== "undefined"
                        }
                    >
                        리뷰 남기기
                    </Button>
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
                    ratingReadOnly={false}
                    onRatingChangeHandler={this.props.ratingUpdateHandler}
                ></Book>
                <Divider style={{ margin: "5px" }} />
                <Card style={{ backgroundColor: "#FFFFFF00" }}>{review}</Card>

                <ReviewModal
                    isModalOpen={this.state.isReviewModalOpen}
                    modalCloseHandler={this.closeReviewModal}
                    selectBook={this.props.selectBook}
                    postHandler={this.props.reviewPostHandler}
                    fetchReviewHandler={this.fetchReviewList.bind(this)}
                ></ReviewModal>
            </Container>
        );
    }
}
