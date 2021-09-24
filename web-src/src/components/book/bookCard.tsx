import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type BookCardState = {};

interface BookCardProps {
    index: number;
    title: string;
    author: string;
    category: string;
    image: string;
    publisher: string;
    clickListener: (a1: number) => void;
}

export class BookCard extends React.Component<BookCardProps, BookCardState> {
    render() {
        return (
            <Card
                sx={{ display: "flex", margin: "1px", height: 200 }}
                variant="outlined"
            >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography component="div" variant="h5">
                            {this.props.title
                                .replaceAll("<b>", "")
                                .replaceAll("</b>", "")}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                        >
                            {this.props.author
                                .replaceAll("<b>", "")
                                .replaceAll("</b>", "") +
                                " / " +
                                this.props.category.replace("unknown", " ") +
                                " / " +
                                this.props.publisher}
                        </Typography>
                    </CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 1,
                            pb: 1,
                        }}
                    >
                        <Button
                            onClick={() => {
                                this.props.clickListener(this.props.index);
                            }}
                        >
                            ADD
                        </Button>
                    </Box>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ width: "auto", height: "100%" }}
                    image={this.props.image}
                    alt="Book Thumbnail"
                />
            </Card>
        );
    }
}
