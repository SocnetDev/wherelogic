import React from "react";
import {Admin, Game, PlayerScreen} from "./pages";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export default function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                        <li>
                            <Link to="/player">player</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/player">
                        <PlayerScreen/>
                    </Route>
                    <Route path="/admin">
                        <Admin/>
                    </Route>
                    <Route path="/">
                        <Game/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

