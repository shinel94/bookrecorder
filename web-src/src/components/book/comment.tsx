import React from "react";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";

type CommentState = {};

interface CommentProps {
    clickUserId: string;
    commentUserId: string;
    comment: string;
    deleteCommentHandler: () => void;
}

export class Comment extends React.Component<CommentProps, CommentState> {
    render() {
        const deleteButton =
            this.props.commentUserId === this.props.clickUserId ? (
                <Button onClick={this.props.deleteCommentHandler}>
                    Delete
                </Button>
            ) : undefined;
        return (
            <Card
                style={{
                    margin: "2%",
                    padding: "1%",
                    height: "0.8rem",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {this.props.commentUserId.split("@")[0] +
                    " : " +
                    this.props.comment}
                {deleteButton}
            </Card>
        );
    }
}
