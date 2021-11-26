import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {barbershopOwnerRoutes, adminRoutes, routes }from "./routes";
import useAuth from "../hooks/useAuth";
import {ADMIN_ROLE, BARBERSHOP_OWNER_ROLE} from "./../utils/constants";




export default function AppRouter() {
    const { user } = useAuth();
    if (user && user.role === ADMIN_ROLE) {
      return (
        <Router>
          <Switch>
            {adminRoutes.map((route, index) => (
              <RouteWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        </Router>
      );
    } else if (user && user.role === BARBERSHOP_OWNER_ROLE) {
      return (
        <Router>
          <Switch>
            {barbershopOwnerRoutes.map((route, index) => (
              <RouteWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        </Router>
      );
    } else {
      return (
        <Router>
          <Switch>
            {routes.map((route, index) => (
              <RouteWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        </Router>
      );
    }
}

function RouteWithSubRoutes(route){
  return(
    <Route 
      path={route.path} 
      exact={route.exact} 
      render={props => <route.component routes={route.routes}{...props} />}
      />
  )
}