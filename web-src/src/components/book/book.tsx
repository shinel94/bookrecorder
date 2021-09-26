import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

type BookState = {};

interface BookProps {
    index: number;
    title: string;
    author: string;
    category: string;
    image: string;
    onClickHandler: (a1: number) => void;
    cursor: string;
}

export class Book extends React.Component<BookProps, BookState> {
    render() {
        return (
            <Card
                sx={{
                    display: "flex",
                    height: 200,
                    width: "800px",
                    fontFamily: "KCC",
                    margin: "1%",
                    marginBottom: "0%",
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
                        <Typography component="div" variant="h5">
                            {"제목: " +
                                this.props.title
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
                </Box>
            </Card>
        );
    }
}
