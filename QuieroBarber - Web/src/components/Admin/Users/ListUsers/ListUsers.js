import React, { useState, useEffect } from "react";
import {
  Switch,
  List,
  Avatar,
  Button,
  Modal as ModalAntd,
  notification,
  Skeleton,
} from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import Modal from "./../../../Shared/Modal";
import { getAvatarApi, activateUserApi, deleteUserApi } from "../../../../api/user";
import { getAccessTokenApi } from "../../../../api/auth";
import EditUserForm from "../EditUserForm";
import AddUserForm from "../AddUserForm/AddUserForm";
import {
  EditOutlined,
  StopOutlined,
  DeleteOutlined,
  CheckOutlined,
  UserAddOutlined
} from "@ant-design/icons";

import "./ListUsers.scss";


const { confirm } = ModalAntd;


export default function ListUsers(props) {
  //setReloadUsers -> recarga la lista de usuarios
  const { activeUsers, inactiveUsers, setReloadUsers, isLoading} = props;
  const [viewUsersActives, setViewUsersActives] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const addUserModal = ()=>{
    setModalVisible(true);
    setModalTitle("Creando nuevo usuario");
    setModalContent(<AddUserForm setModalVisible={setModalVisible} setReloadUsers={setReloadUsers} />)
  }
  

  const showDeleteConfirm = (user) => {
    const accessToken = getAccessTokenApi();
    confirm({
      title: "Eliminando usuario",
      content: `¿Está seguro que quiere eliminar usuario ${user.name} ${user.lastName}?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        deleteUserApi(accessToken, user._id)
          .then((response) => {
            notification["success"]({
              message: response,
            });
            setReloadUsers(true);
          })
          .catch((error) => {
            notification["error"]({
              message: error,
            });
          });
      },
    });
  };


  if (isLoading) {
    return (
      <>
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </>
    )
  } else {
  return (
    <div className="list-users">
      <div className="list-users_header">
        <div className="list-users_header-switch">
          <Switch
            defaultChecked
            onChange={() => setViewUsersActives(!viewUsersActives)}
          />
          <span>
            {viewUsersActives ? "Usuarios Activos" : "Usuarios Inactivos"}
          </span>
        </div>
        <Button
          type="primary"
          onClick={addUserModal}
          icon={<UserAddOutlined />}
        >
          Nuevo Usuario
        </Button>
      </div>

      {viewUsersActives ? (
        <ActiveUsers
          activeUsers={activeUsers}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadUsers={setReloadUsers}
          showDeleteConfirm={showDeleteConfirm}
        />
      ) : (
        <InactiveUsers
          inactiveUsers={inactiveUsers}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadUsers={setReloadUsers}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}

      <Modal
        title={modalTitle}
        isVisible={isModalVisible}
        setModalVisible={setModalVisible}
      >
        {modalContent}
      </Modal>
    </div>
  );
}}

function ActiveUsers(props) {
  const {
    activeUsers,
    setModalVisible,
    setModalContent,
    setModalTitle,
    setReloadUsers,
    showDeleteConfirm
  } = props;

  const editUser = (user) => {
    setModalVisible(true);
    setModalTitle(`Editar ${user.name} ${user.lastName}`);
    setModalContent(
      <EditUserForm
        user={user}
        setModalVisible={setModalVisible}
        setReloadUsers={setReloadUsers}
        isFromMenuTop = {false}
        
      />
    );
  };

  return (
    <List
      className="users-active"
      itemLayout="horizontal"
      dataSource={activeUsers}
      renderItem={(user) => (
        <UserActiveItem
          user={user}
          editUser={editUser}
          setReloadUsers={setReloadUsers}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function UserActiveItem(props) {
  const {
    user,
    editUser,
    setReloadUsers,
    showDeleteConfirm
  } = props;
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

  const desactivateUser = ()=>{
    const accessToken = getAccessTokenApi();
    activateUserApi(accessToken, user._id, false).then(response =>{
      notification["success"]({
        message: response
      });
      setReloadUsers(true);
    }).catch(err=>{
      notification["error"]({
        message: err,
      });
    })
  }

  const deleteConfirm=()=>{
     showDeleteConfirm(user);
  }

  return (
    <List.Item
      actions={[
        <Button type="primary" onClick={() => editUser(user)}>
          <EditOutlined />
        </Button>,
        <Button type="danger" onClick={desactivateUser}>
          <StopOutlined />
        </Button>,
        <Button type="danger" onClick={deleteConfirm}>
          <DeleteOutlined />
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
        title={`${user.name ? user.name : "..."}
            ${user.lastName ? user.lastName : "..."}
            `}
        description={user.email}
      />
    </List.Item>
  );

}

function InactiveUsers(props) {
  const {
    inactiveUsers,
    setReloadUsers,
    showDeleteConfirm
  } = props;
  return (
    <List
      className="users-active"
      itemLayout="horizontal"
      dataSource={inactiveUsers}
      renderItem={(user) => (
        <UserInactiveItem
          user={user}
          setReloadUsers={setReloadUsers}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function UserInactiveItem(props){
    const {
      user,
      setReloadUsers,
      showDeleteConfirm,
    } = props;
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



    const activateUser = () => {
      const accessToken = getAccessTokenApi();
      activateUserApi(accessToken, user._id, true)
        .then((response) => {
          notification["success"]({
            message: response,
          });
          setReloadUsers(true);
        })
        .catch((err) => {
          notification["error"]({
            message: err,
          });
        });
    };


    const deleteConfirm = ()=>{
       showDeleteConfirm(user);
    }


    return (
      <List.Item
        actions={[
          <Button type="primary" onClick={activateUser}>
            <CheckOutlined />
          </Button>,
          <Button type="danger" onClick={deleteConfirm}>
            <DeleteOutlined />
          </Button>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
          title={`${user.name ? user.name : "..."}
                    ${user.lastName ? user.lastName : "..."}
            `}
          description={user.email}
        />
      </List.Item>
    );
}



