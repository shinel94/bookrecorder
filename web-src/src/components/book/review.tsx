import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BookReviewModel, QuantityKeyValueMap } from "../../utils/constant";
import { Rating } from "@mui/material";
import { Comment } from "./comment";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

type ReviewState = {
    showReview: boolean;
};

interface ReviewProps {
    clickUserNickName: string;
    ReviewData: BookReviewModel;
}

export class Review extends React.Component<ReviewProps, ReviewState> {
    state: ReviewState = {
        showReview: false,
    };
    render() {
        const sComment = Object.keys({ a: "good", b: "그렇군요" }).map(
            (key: string) => {
                console.log(this.props.ReviewData.comment[key]);
                return <Comment />;
            }
        );
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
                            {this.state.showReview ? "리뷰 접기" : "리뷰 보기"}
                        </Button>
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
                </div>
            </Card>
        );
    }
}
