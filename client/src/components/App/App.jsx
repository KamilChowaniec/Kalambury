import React from "react";
import history from "urlHistory";
import { Router, Switch, Route } from "components/Router";
import Room from "components/Room";
import Header from "components/Header";
import Home from "components/Home";
import S from "./App.module.css";

const App = () => {
  return (
    <Router history={history}>
      <div className={S.app}>
        <Header />
        <Switch>
          <Route path="/Room/:roomId">
            <Room />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
