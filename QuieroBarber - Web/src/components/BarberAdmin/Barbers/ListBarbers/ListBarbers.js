import React, { useState, useEffect } from "react";
import {
  Switch,
  List,
  Avatar,
  Button,
  Skeleton,
  Tooltip,
  Modal as ModalAntd,
  notification
} from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import Modal from "../../../Shared/Modal";
import {
  getAvatarApi,
  activateBarberApi,
  deleteBarberApi,
} from "../../../../api/barber";
import { getAccessTokenApi } from "../../../../api/auth";
import EditBarberForm from "../EditBarber";
import AddBarberForm from "../AddBarber";
import {
  EditOutlined,
  StopOutlined,
  DeleteOutlined,
  CheckOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import "./ListBarbers.scss";

const { confirm } = ModalAntd;

export default function ListBarbers(props) {
  const { activeBarbers, inactiveBarbers, setReloadBarbers, isLoading } = props;
  const [viewBarbersActives, setViewBarbersActives] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);


  const addBarberModal = () => {
    setModalVisible(true);
    setModalTitle("Creando nuevo barbero");
    setModalContent(
      <AddBarberForm
        setModalVisible={setModalVisible}
        setReloadBarbers={setReloadBarbers}
      />
    );
  };

  const showDeleteConfirm = (barber) => {
    const accessToken = getAccessTokenApi();
    confirm({
      title: "Eliminando barbero",
      content: `¿Está seguro que quiere eliminar el barbero ${barber.name} ${barber.lastName}?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        deleteBarberApi(accessToken, barber._id)
          .then((response) => {
            setReloadBarbers(true);
            notification["success"]({
              message: response,
            });
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
    <div className="list-items">
      <div className="list-items_header">
        <div className="list-items_header-switch">
          <Switch
            defaultChecked
            onChange={() => setViewBarbersActives(!viewBarbersActives)}
          />
          <span>
            {viewBarbersActives ? "Barberos Activos" : "Barberos Inactivos"}
          </span>
        </div>
        <Button
          type="primary"
          onClick={addBarberModal}
          icon={<UserAddOutlined />}
        >
          Nuevo Barbero
        </Button>
      </div>

      {viewBarbersActives ? (
        <ActiveBarbers
          activeBarbers={activeBarbers}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadBarbers={setReloadBarbers}
          showDeleteConfirm={showDeleteConfirm}
        />
      ) : (
        <InactiveBarbers
          inactiveBarbers={inactiveBarbers}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadBarbers={setReloadBarbers}
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
}
}
function ActiveBarbers(props) {
  const {
    activeBarbers,
    setModalVisible,
    setModalContent,
    setModalTitle,
    setReloadBarbers,
    showDeleteConfirm,
  } = props;

  const editBarber = (barber) => {
    setModalVisible(true);
    setModalTitle(`Editar ${barber.name} ${barber.lastName}`);
    setModalContent(
      <EditBarberForm
        barber={barber}
        setModalVisible={setModalVisible}
        setReloadBarbers={setReloadBarbers}
      />
    );
  };

  return (
    <List
      className="items-active"
      itemLayout="horizontal"
      split ="true"
      dataSource={activeBarbers}
      renderItem={(barber) => (
        <BarberActiveItem
          barber={barber}
          editBarber={editBarber}
          setReloadBarbers={setReloadBarbers}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function BarberActiveItem(props) {
  const { barber, editBarber, setReloadBarbers, showDeleteConfirm } = props;
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (barber.avatar) {
      getAvatarApi(barber.avatar).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [barber]);

  const desactivateBarber = () => {
    const accessToken = getAccessTokenApi();

    activateBarberApi(accessToken, barber._id, false)
      .then((response) => {
        setReloadBarbers(true);
        notification["success"]({
          message: response,
        });
      })
      .catch((err) => {
        notification["error"]({
          message: err,
        });
      });
  };

  const deleteConfirm = () => {
    showDeleteConfirm(barber);
  };

  return (
    <List.Item
      actions={[
        <Tooltip placement="top" title="Editar" color="#133046">
          <Button type="primary" onClick={() => editBarber(barber)}>
            <EditOutlined />
          </Button>
        </Tooltip>,
        <Tooltip placement="top" title="Desactivar" color="#133046">
          <Button type="danger" onClick={desactivateBarber}>
            <StopOutlined />
          </Button>
        </Tooltip>,
        <Tooltip placement="top" title="Eliminar" color="#133046">
          <Button type="danger" onClick={deleteConfirm}>
            <DeleteOutlined />
          </Button>
        </Tooltip>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
        title={barber.name}
        description={barber.description}
      />
    </List.Item>
  );
}

function InactiveBarbers(props) {
  const { inactiveBarbers, setReloadBarbers, showDeleteConfirm } = props;
  return (
    <List
      className="items-active"
      itemLayout="horizontal"
      dataSource={inactiveBarbers}
      renderItem={(barber) => (
        <BarberInactiveItem
          barber={barber}
          setReloadBarbers={setReloadBarbers}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function BarberInactiveItem(props) {
  console.log(props);
  const { barber, setReloadBarbers, showDeleteConfirm } = props;
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (barber.avatar) {
      getAvatarApi(barber.avatar).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [barber]);

  const activateBarber = () => {
    const accessToken = getAccessTokenApi();
    activateBarberApi(accessToken, barber._id, true)
    .then((response) => {
      setReloadBarbers(true);
      notification["success"]({
        message: response,
      });
      })
      .catch((err) => {
        notification["error"]({
          message: err,
        });
      });
  };

  const deleteConfirm = () => {
    showDeleteConfirm(barber);
  };

  return (
    <List.Item
      actions={[
        <Tooltip placement="top" title="Activar" color="#133046">
          <Button type="primary" onClick={activateBarber}>
            <CheckOutlined />
          </Button>
        </Tooltip>,
        <Tooltip placement="top" title="Eliminar" color="#133046">
          <Button type="danger" onClick={deleteConfirm}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
        title={barber.name +" "+ barber.lastName}
        description={barber.description}
      />
    </List.Item>
  );
}
