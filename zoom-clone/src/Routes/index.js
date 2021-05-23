import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import JoinRoom from "../views/JoinRoom";
import Room from "../views/Rooms";

export const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Redirect to="/join_room" />
        </Route>
        <Route exact path="/join_room" component={JoinRoom} />
        <Route path="/room/:id" component={Room} />
      </Switch>
    </div>
  );
};
