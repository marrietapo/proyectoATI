import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Button, Avatar, Popover, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Logo from "../../../assets/img/png/logo-dashboard.png";
import { logout } from "../../../api/auth";
import NoAvatar from "../../../assets/img/png/no-avatar.png"
import {getAvatarApi } from "../../../api/user";
import EditUserForm from "../../Admin/Users/EditUserForm";
import Modal from "./../../Shared/Modal";

import "./MenuTop.scss"

export default function MenuTop(props){
  
  const {menuCollapsed, setMenuCollapsed, user} = props;

    return (
      <>
      <div className="menu-top">
        <div className="menu-top_left">
          <Link to={"/"}>
            <img className="menu-top_left_logo" src={Logo} alt="Logo" />
          </Link>
          <Button type="link" onClick={() => setMenuCollapsed(!menuCollapsed)}>
            {menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <div className="menu-top_right">
          <ShowUserData user={user} />
        </div>
      </div>
      </>
    );
}

function ShowUserData(props){
  const {user}= props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user.avatar) {
      getAvatarApi(user.avatar).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [user]);



  return (
    <>
    <Popover
      placement="bottom"
      content={
        <PopoverMenu
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          user={user}
        />
      }
      trigger="hover"
      className="menu-top_popover"
    >
      <span className="menu-top_name">👋 Hola, {user.name}</span>
      <span className="menu-top_avatar">
        <Avatar src={avatar ? avatar : NoAvatar} />
      </span>
    </Popover>
                <Modal
        title={modalTitle}
        isVisible={isModalVisible}
        setModalVisible={setModalVisible}
      >
        {modalContent}
      </Modal>
      </>
  );
}

function PopoverMenu(props){

  const { setModalVisible, setModalContent, setModalTitle, user } = props;

    const logoutUser = () => {
      logout();
      window.location.reload();
    };
  
    const editUser = () => {
      setModalVisible(true);
      setModalTitle(`Editar ${user.name} ${user.lastName}`);
      setModalContent(
        <EditUserForm
          user={user}
          setModalVisible={setModalVisible}
          isFromMenuTop = {true}
        />
      );
    };

  return (
    <Menu className="menu-top_menu" mode="vertical" theme="light">
      <Menu.Item
        key="1"
        icon={<EditOutlined />}
        className="menu-top_menu_item"
        onClick={() => editUser()}
      >
        Editar Usuario
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<PoweroffOutlined />}
        onClick={() => logoutUser()}
      >
        Salir
      </Menu.Item>
    </Menu>
  );
}
