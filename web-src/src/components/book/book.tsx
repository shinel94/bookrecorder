import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { StatusEnum } from "../../utils/constant";
import Rating from "@mui/material/Rating";

type BookState = {};

interface BookProps {
    index: number;
    title: string;
    author: string;
    category: string;
    image: string;
    onClickHandler: (a1: number) => void;
    cursor: string;
    startDate: string;
    finishDate: string | null;
    status: number;
    rate: number;
    onRatingChangeHandler: (rating: number) => void;
    ratingReadOnly: boolean;
}

export class Book extends React.Component<BookProps, BookState> {
    render() {
        return (
            <Card
                sx={{
                    display: "flex",
                    height: 250,
                    width: "800px",
                    fontFamily: "KCC",
                    margin: "1%",
                    marginBottom: "0%",
                    marginLeft: "0",
                    cursor: this.props.cursor,
                }}
                variant="outlined"
                onClick={() => {
                    this.props.onClickHandler(this.props.index);
                }}
            >
                <CardMedia
                    component="img"
                    sx={{ width: "auto", height: "95%", margin: "1%" }}
                    image={this.props.image}
                    alt="Book Thumbnail"
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography variant="h5" display="inline" noWrap>
                            {this.props.title
                                .replaceAll("<b>", "")
                                .replaceAll("</b>", "")}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                        >
                            {"작가: " +
                                this.props.author
                                    .replaceAll("<b>", "")
                                    .replaceAll("</b>", "")}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                        >
                            {"장르: " +
                                this.props.category.replace("unknown", " ")}
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography component="div" variant="subtitle1">
                            {StatusEnum[this.props.status]}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            component="div"
                        >
                            {"시작 일: " + this.props.startDate.split(" ")[0]}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            component="div"
                        >
                            {"종료 일: " +
                                (this.props.finishDate === null
                                    ? " "
                                    : this.props.finishDate.split(" ")[0])}
                        </Typography>
                        <Rating
                            name="rating"
                            value={this.props.rate / 2}
                            readOnly={this.props.ratingReadOnly}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    this.props.onRatingChangeHandler(
                                        newValue * 2
                                    );
                                }
                            }}
                        />
                    </CardContent>
                </Box>
            </Card>
        );
    }
}
