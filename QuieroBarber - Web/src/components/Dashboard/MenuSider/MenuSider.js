import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  IdcardOutlined,
  CommentOutlined,
  BarsOutlined,
  FireOutlined,
  CalendarOutlined,
  FileImageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import {BARBERSHOP_OWNER_ROLE, ADMIN_ROLE} from "./../../../utils/constants"


import "./MenuSider.scss";

function MenuSider(props){
  const {menuCollapsed, location, user, myBarbershop} = props;
  const {Sider} = Layout;
    
    console.log(myBarbershop)

    return (
      <Sider className="admin-sider" collapsed={menuCollapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
        >
          {user.role === ADMIN_ROLE ? (
            <>
              <Menu.Item key="/">
                <Link to={"/"}>
                  <HomeOutlined />
                  <span className="nav-text">Home</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/users">
                <Link to={"/users"}>
                  <UserOutlined />
                  <span className="nav-text">Usuarios</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/barbershops">
                <Link to={"/barbershops"}>
                  <BarsOutlined />
                  <span className="nav-text">Barberías</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/notifications">
                <Link to={"/notifications"}>
                  <SendOutlined />
                  <span className="nav-text">Notificaciones</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/create-barbershop">
                <Link to={"/create-barbershop"}>
                  <HomeOutlined />
                  <span className="nav-text">Crear Barbería</span>
                </Link>
              </Menu.Item>
            </>
          ) : (
            <></>
          )}
          {user.role === BARBERSHOP_OWNER_ROLE ? (
            <>
              {myBarbershop === [] ? (
                <Menu.Item key="/create-barbershop">
                  <Link to={"/create-barbershop"}>
                    <HomeOutlined />
                    <span className="nav-text">Crear Barbería</span>
                  </Link>
                </Menu.Item>
              ) : (
                <>
                  <Menu.Item key="/barbershop">
                    <Link to={"/barbershop"}>
                      <HomeOutlined />
                      <span className="nav-text">Mi Barbería</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/barbers">
                    <Link to={"/barbers"}>
                      <IdcardOutlined />
                      <span className="nav-text">Barberos</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/services">
                    <Link to={"/services"}>
                      <FireOutlined />
                      <span className="nav-text">Servicios</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/barbershop-images">
                    <Link to={"/barbershop-images"}>
                      <FileImageOutlined />
                      <span className="nav-text">Imágenes</span>
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="/social-links">
                    <Link to={"/social-links"}>
                      <LikeOutlined />
                      <span className="nav-text">Redes Sociales</span>
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item key="/comments">
                    <Link to={"/comments"}>
                      <CommentOutlined />
                      <span className="nav-text">Comentarios</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/reservations">
                    <Link to={"/reservations"}>
                      <CalendarOutlined />
                      <span className="nav-text">Reservas</span>
                    </Link>
                  </Menu.Item>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </Menu>
      </Sider>
    );
}

export default withRouter(MenuSider);