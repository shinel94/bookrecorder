import { Stack } from "@mui/material";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

type BookInfoState = {};

interface BookInfoProps {
    userId: string;
    userToken: string;
    clickListner: (a1: boolean) => void;
    totalBookNumber: number;
    readBookNumber: number;
}

export class BookInfo extends React.Component<BookInfoProps, BookInfoState> {
    componentDidMount() {}

    render() {
        return (
            <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
            >
                <Box
                    style={{ width: "100%", margin: "5%", cursor: "pointer" }}
                    onClick={() => {
                        this.props.clickListner(false);
                    }}
                >
                    <h5>{"Total " + this.props.totalBookNumber || 0}</h5>
                </Box>
                <Box
                    style={{ width: "100%", margin: "5%", cursor: "pointer" }}
                    onClick={() => {
                        this.props.clickListner(true);
                    }}
                >
                    <h5>{"Now " + this.props.readBookNumber || 0}</h5>
                </Box>
            </Stack>
        );
    }
}
