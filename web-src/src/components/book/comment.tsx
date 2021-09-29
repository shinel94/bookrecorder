import React from "react";
import Card from "@mui/material/Card";

type CommentState = {};

interface CommentProps {}

export class Comment extends React.Component<CommentProps, CommentState> {
    render() {
        return (
            <Card>
                <h1>Comment</h1>
            </Card>
        );
    }
}
