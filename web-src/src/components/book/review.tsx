import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BookReviewModel, QuantityKeyValueMap } from "../../utils/constant";
import { Rating, TextField } from "@mui/material";
import { Comment } from "./comment";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

type ReviewState = {
    showReview: boolean;
    addComment: string;
};

interface ReviewProps {
    clickUserId: string;
    clickUserNickName: string;
    ReviewData: BookReviewModel;
    deleteReviewHandler: (isbn: number) => void;
    postCommentHandler: (comment: string, review_index: string) => void;
    fetchReviwe: () => void;
    deleteCommentHandler: (review_index: string) => void;
}

export class Review extends React.Component<ReviewProps, ReviewState> {
    state: ReviewState = {
        showReview: false,
        addComment: "",
    };

    addCommentChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                addComment: event.target.value.substring(0, 30),
            };
        });
    };

    deleteCommentHandler = async () => {
        await this.props.deleteCommentHandler(
            this.props.ReviewData.review_index
        );
        await this.props.fetchReviwe();
    };

    render() {
        console.log(
            Object.keys(this.props.ReviewData.comment).indexOf(
                this.props.clickUserId
            )
        );
        const sComment = Object.keys(this.props.ReviewData.comment).map(
            (key: string) => {
                return (
                    <Comment
                        key={key}
                        commentUserId={key}
                        comment={this.props.ReviewData.comment[key]}
                        clickUserId={this.props.clickUserId}
                        deleteCommentHandler={this.deleteCommentHandler.bind(
                            this
                        )}
                    />
                );
            }
        );

        const sAddComment = (
            <div>
                <Divider />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "1%",
                    }}
                >
                    <TextField
                        id="add-comment"
                        value={this.state.addComment}
                        onChange={this.addCommentChangeHandler}
                        style={{ width: "80%" }}
                        label="Comment"
                    />
                    <Button
                        onClick={async () => {
                            await this.props.postCommentHandler(
                                this.state.addComment,
                                this.props.ReviewData.review_index
                            );
                            this.setState((prevState) => {
                                return {
                                    ...prevState,
                                    addComment: "",
                                };
                            });
                            await this.props.fetchReviwe();
                        }}
                        disabled={
                            Object.keys(this.props.ReviewData.comment).indexOf(
                                this.props.clickUserId
                            ) !== -1
                        }
                    >
                        Add
                    </Button>
                </div>
            </div>
        );

        const sDeleteButton =
            this.props.clickUserNickName ===
            this.props.ReviewData.user_nickname ? (
                <Button
                    onClick={() => {
                        this.setState((prevState) => {
                            return {
                                ...prevState,
                                showReview: !this.state.showReview,
                            };
                        });
                    }}
                >
                    삭제
                </Button>
            ) : undefined;
        // const sComment = Object.keys(this.props.ReviewData.comment).map(
        //     (key: string) => {
        //         console.log(this.props.ReviewData.comment[key]);
        //         return <Comment />;
        //     }
        // );
        return (
            <Card style={{ padding: "1%", margin: "1%" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h5" display="inline" noWrap>
                            {this.props.ReviewData.user_nickname}
                        </Typography>
                        <div>
                            {sDeleteButton}
                            <Button
                                onClick={() => {
                                    this.setState((prevState) => {
                                        return {
                                            ...prevState,
                                            showReview: !this.state.showReview,
                                        };
                                    });
                                }}
                            >
                                {this.state.showReview
                                    ? "댓글 접기"
                                    : "댓글 보기"}
                            </Button>
                        </div>
                    </div>
                    <div>
                        {"총평 : "}
                        <Rating
                            name="totalRating"
                            value={this.props.ReviewData.score.total / 2}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                        {"흥미 / 재미 : "}
                        <Rating
                            name="interestRating"
                            value={this.props.ReviewData.score.interest / 2}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                        {"가독성 : "}
                        <Rating
                            name="totalRating"
                            value={this.props.ReviewData.score.readability / 2}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                        <Typography
                            style={{ paddingLeft: "5px", fontFamily: "KCC" }}
                            display="inline"
                            noWrap
                        >
                            {"분량 : " +
                                QuantityKeyValueMap[
                                    this.props.ReviewData.score.quantity
                                ]}
                        </Typography>
                    </div>
                    <div
                        style={{
                            border: "1px solid gray",
                            width: "95%",
                            minHeight: "100px",
                            padding: "1%",
                            marginTop: "2%",
                            marginRight: "2%",
                        }}
                    >
                        <Typography
                            display="inline"
                            style={{ fontFamily: "KCC" }}
                        >
                            {this.props.ReviewData.review}
                        </Typography>
                    </div>
                </CardContent>
                <Divider />
                <div style={{ margin: "1%" }}>
                    {this.state.showReview ? sComment : undefined}
                    {this.state.showReview ? sAddComment : undefined}
                </div>
            </Card>
        );
    }
}
