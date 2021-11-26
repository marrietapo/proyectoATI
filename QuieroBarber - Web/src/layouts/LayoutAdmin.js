import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import MenuTop from "../components/Dashboard/MenuTop";
import MenuSider from "../components/Dashboard/MenuSider";
import { getBarbershopByOwnerApi } from "../api/barbershop";

import Auth from "../pages/Auth";
import useAuth from "../hooks/useAuth";
import { getAccessTokenApi } from "../api/auth";

import "./LayoutAdmin.scss";

export default function LayoutAdmin(props) {
  const { routes } = props;
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { Header, Content, Footer } = Layout;
  const { user, isLogged } = useAuth();
  const [myBarbershop, setMyBarbershop] = useState();
  const token = getAccessTokenApi();
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if(user!==null){
      getBarbershopByOwnerApi(token, user._id).then((response) => {
        setMyBarbershop(response.barbershop);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(()=>{
    setLoading(false);
  }, [myBarbershop])
  
  if (!user && !isLogged && !loading) {
    return (
      <>
        <Route path="/login" component={Auth} />
        <Redirect to="/login" />
      </>
    );
  }
  if (user && isLogged && !loading) {

      return (
        <Layout>
          <MenuSider
            menuCollapsed={menuCollapsed}
            user={user}
            myBarbershop={myBarbershop}
          />
          <Layout
            className="layout-admin"
            style={{ marginLeft: menuCollapsed ? "80px" : "200px" }}
          >
            <Header className="layout-admin_header">
              <MenuTop
                menuCollapsed={menuCollapsed}
                setMenuCollapsed={setMenuCollapsed}
                user={user}
              />
            </Header>
            <Content className="layout-admin_content">
              <LoadRoutes routes={routes}></LoadRoutes>
            </Content>
            <Footer className="layout-admin_footer">Footer</Footer>
          </Layout>
        </Layout>
      );
    
  }

  return null;
}

function LoadRoutes(props) {
  const { routes } = props;
  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </Switch>
  );
}
