import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Login } from "./components/login";
import { Main } from "./components/main";
import { ApiAdapter } from "./api/api";
import Divider from "@mui/material/Divider";

const App: React.FC = (props) => {
    const [userId, setUserId] = useState("");
    const [userToekn, setUserToken] = useState("");
    const [userNickname, setUserNcikname] = useState("");
    const logoutHandler = () => {
        ApiAdapter.sendLogoutRequest(userId);
        setUserToken("");
    };

    return (
        <div className="App">
            <h3 style={{ textAlign: "center" }}>BookRecoder</h3>
            <Divider />
            <BrowserRouter>
                <Route
                    exact
                    path="/"
                    render={(props) => {
                        return (
                            <Login
                                setUserId={setUserId}
                                setUserToekn={setUserToken}
                                setUserNcikname={setUserNcikname}
                                {...props}
                            />
                        );
                    }}
                />
                <Route
                    exact
                    path="/main"
                    render={(props) => (
                        <Main
                            userId={userId}
                            userNickname={userNickname}
                            userToken={userToekn}
                            logoutHandler={logoutHandler.bind(this)}
                            {...props}
                        />
                    )}
                />
            </BrowserRouter>
        </div>
    );
};

export default App;
