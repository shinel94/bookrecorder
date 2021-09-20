import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Login } from "./components/login";
import { Main } from "./components/main";

const App: React.FC = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Route exact path="/" component={Login} />
                <Route exact path="/main" component={Main} />/
            </BrowserRouter>
        </div>
    );
};

export default App;
