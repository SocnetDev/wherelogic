import React from "react";
import { Admin, Game, PlayerScreen } from "./pages";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

export default function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/player">
                        <PlayerScreen />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                    <Route path="/">
                        <Game />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

