import { Stack } from "@mui/material";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { ApiAdapter } from "../../api/api";
import { BookInfoModel } from "../../utils/constant";

type BookInfoState = {
    bookList: BookInfoModel[];
    totalBookNumber: number;
    readBookNumber: number;
};

interface BookInfoProps {
    userId: string;
    userToken: string;
}

export class BookInfo extends React.Component<BookInfoProps, BookInfoState> {
    state: BookInfoState = {
        bookList: [],
        totalBookNumber: 0,
        readBookNumber: 0,
    };

    componentDidMount() {
        ApiAdapter.sendGetBookListRequest(
            this.props.userId,
            this.props.userToken
        ).then((a_book_list) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    bookList: a_book_list,
                    totalBookNumber: 10,
                    readBookNumber: 2,
                };
            });
        });
    }

    render() {
        return (
            <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
            >
                <Box style={{ width: "100%", margin: "5%" }}>
                    <h5>{"Total " + this.state.totalBookNumber || 0}</h5>
                </Box>
                <Box style={{ width: "100%", margin: "5%" }}>
                    <h5>{"Now " + this.state.readBookNumber || 0}</h5>
                </Box>
            </Stack>
        );
    }
}
