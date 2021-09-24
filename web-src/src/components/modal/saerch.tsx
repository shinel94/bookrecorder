import React from "react";
import Modal from "@mui/material/Modal";
import { BookCard } from "../book/bookCard";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { SearchedBookModel } from "../../utils/constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@mui/material/Paper";

type SearchState = {
    searchKeyword: string;
    bookList: SearchedBookModel[];
    isLoading: boolean;
};

type SearchProps = {
    isModalOpen: boolean;
    modalCloseHandler: () => void;
    searchHandler: (a1: string) => Promise<SearchedBookModel[]>;
    addBookHandler: (book: SearchedBookModel) => void;
};

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "1px solid #bdb2ff",
    boxShadow: 12,
    p: 4,
    fontFamily: "KCC",
};
const inputStyle = {
    margin: "5px",
    width: "80%",
    fontFamily: "KCC",
    fontSize: "0.5rem",
};

export class Search extends React.Component<SearchProps, SearchState> {
    state: SearchState = {
        searchKeyword: "",
        bookList: [],
        isLoading: false,
    };

    keywordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                searchKeyword: event.target.value,
            };
        });
    };

    searchHandler = async () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: true,
            };
        });
        const sBookList: any[] = [];
        await this.props
            .searchHandler(this.state.searchKeyword)
            .then((response) => sBookList.push(...response));
        this.setState((prevState) => {
            return { ...prevState, bookList: sBookList };
        });
        this.setState((prevState) => {
            return {
                ...prevState,
                isLoading: false,
            };
        });
    };

    clickListener = (index: number) => {
        console.log(index);
        this.props.addBookHandler(this.state.bookList[index]);
        this.props.modalCloseHandler();
    };

    render() {
        return (
            <Modal
                open={this.props.isModalOpen}
                onClose={this.props.modalCloseHandler}
                style={{ fontFamily: "KCC" }}
            >
                <Box sx={style}>
                    <div>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            style={{ marginBottom: "25px", fontFamily: "KCC" }}
                        >
                            Book Search
                        </Typography>

                        <InputLabel
                            htmlFor="filled-adornment-password"
                            style={{ fontFamily: "KCC" }}
                        >
                            KEYWORD
                        </InputLabel>
                        <OutlinedInput
                            id="user-id-input"
                            type="text"
                            value={this.state.searchKeyword}
                            onChange={this.keywordChangeHandler}
                            label="Id"
                            style={inputStyle}
                        />
                        <IconButton
                            style={{ marginLeft: "5%" }}
                            onClick={this.searchHandler}
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading ? (
                                <CircularProgress />
                            ) : (
                                <SearchIcon />
                            )}
                        </IconButton>
                    </div>
                    <Divider />
                    <Paper style={{ maxHeight: 600, overflow: "auto" }}>
                        {this.state.bookList.map((item, index) => (
                            <BookCard
                                key={index}
                                index={index}
                                title={item.title}
                                author={item.author}
                                category={item.category}
                                image={item.image}
                                publisher={item.publisher}
                                clickListener={this.clickListener}
                            ></BookCard>
                        ))}
                    </Paper>
                </Box>
            </Modal>
        );
    }
}
