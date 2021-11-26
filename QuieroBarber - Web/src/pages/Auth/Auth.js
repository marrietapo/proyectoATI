import React from "react";
import { Layout, Tabs} from "antd";
import { Redirect } from "react-router-dom";
import Logo from "../../assets/img/png/logo.png";
import Register from "../../components/Auth/Register";
import Login from "../../components/Auth/Login";
import { getAccessTokenApi } from "../../api/auth";

import "./Auth.scss";

export default function Auth() {
  const { Content } = Layout;
  const { TabPane } = Tabs;

  if (getAccessTokenApi()) {
    return <Redirect to="/" />;
  }

  return (
    <Layout className="sign-in">
      <Content className="sign-in_content">

          <h1 className="sign-in_content_logo">
            <img src={Logo} alt="Logo" />
          </h1>

          <div className="sign-in_content_tabs">
            <Tabs type="card">
              <TabPane tab={<span>Entrar</span>} key="1">
                <Login />
              </TabPane>
              <TabPane tab={<span>Registrarme</span>} key="2">
                <Register />
              </TabPane> 
            </Tabs>
          </div>

      </Content>
    </Layout>
  );
}
