import React, { useState, useEffect } from "react";
import {
  Switch,
  List,
  Avatar,
  Tooltip,
  Button,
  Skeleton,
  Modal as ModalAntd,
  notification,
} from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import Modal from "../../../Shared/Modal";
import {
  getLogoApi,
  activateBarbershopApi,
  deleteBarbershopApi,
} from "../../../../api/barbershop";
import { getAccessTokenApi } from "../../../../api/auth";
import EditBarbershopForm from "../EditBarbershop";
import AddBarbershopForm from "../AddBarbershop";
import {
  EditOutlined,
  StopOutlined,
  DeleteOutlined,
  CheckOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import "./ListBarbershops.scss";

const { confirm } = ModalAntd;

export default function ListBarbershops(props) {

  const { activeBarbershops, inactiveBarbershops, setReloadBarbershops, isLoading } = props;
  const [viewBarbershopsActives, setViewBarbershopsActives] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const addBarbershopModal = () => {
    setModalVisible(true);
    setModalTitle("Creando nueva barbería");
    setModalContent(
      <AddBarbershopForm
        setModalVisible={setModalVisible}
        setReloadBarbershops={setReloadBarbershops}
      />
    );
  };

  const showDeleteConfirm = (barbershop) => {
    const accessToken = getAccessTokenApi();
    confirm({
      title: "Eliminando barbería",
      content: `¿Está seguro que quiere eliminar la barbería ${barbershop.name}?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        deleteBarbershopApi(accessToken, barbershop._id)
          .then((response) => {
            setReloadBarbershops(true);
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
            onChange={() => setViewBarbershopsActives(!viewBarbershopsActives)}
          />
          <span>
            {viewBarbershopsActives
              ? "Barberías Activas"
              : "Barberías Inactivas"}
          </span>
        </div>
        {/* <Button
          type="primary"
          onClick={addBarbershopModal}
          icon={<UserAddOutlined />}
        >
          Nueva Barbería
        </Button> */}
        
      </div>

      {viewBarbershopsActives ? (
        <ActiveBarbershops
          activeBarbershops={activeBarbershops}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadBarbershops={setReloadBarbershops}
          showDeleteConfirm={showDeleteConfirm}
        />
      ) : (
        <InactiveBarbershops
          inactiveBarbershops={inactiveBarbershops}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadBarbershops={setReloadBarbershops}
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

function ActiveBarbershops(props) {
  const {
    activeBarbershops,
    setModalVisible,
    setModalContent,
    setModalTitle,
    setReloadBarbershops,
    showDeleteConfirm,
  } = props;

  const editBarbershop = (barbershop) => {
    setModalVisible(true);
    setModalTitle(`Editar ${barbershop.name}`);
    setModalContent(
      <EditBarbershopForm
        barbershop={barbershop}
        setModalVisible={setModalVisible}
        setReloadBarbershops={setReloadBarbershops}
      />
    );
  };

  return (
    <List
      className="items-active"
      itemLayout="horizontal"
      split ="true"
      dataSource={activeBarbershops}
      renderItem={(barbershop) => (
        <BarbershopActiveItem
          barbershop={barbershop}
          editBarbershop={editBarbershop}
          setReloadBarbershops={setReloadBarbershops}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function BarbershopActiveItem(props) {
  const { barbershop, editBarbershop, setReloadBarbershops, showDeleteConfirm } = props;
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (barbershop.logo) {
      getLogoApi(barbershop.logo).then((response) => {
        setLogo(response);
      });
    } else {
      setLogo(null);
    }
  }, [barbershop]);

  const desactivateBarbershop = () => {
    const accessToken = getAccessTokenApi();

    activateBarbershopApi(accessToken, barbershop._id, false)
      .then((response) => {
        setReloadBarbershops(true);
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
    showDeleteConfirm(barbershop);
  };

  return (
    <List.Item
      actions={[
        <Tooltip placement="top" title="Editar" color="#133046">
        <Button type="primary" onClick={() => editBarbershop(barbershop)}>
          <EditOutlined />
        </Button>
        </Tooltip>,
        <Tooltip placement="top" title="Desactivar" color="#133046">
        <Button type="danger" onClick={desactivateBarbershop}>
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
        avatar={<Avatar src={logo ? logo : NoAvatar} />}
        title={barbershop.name}
        description={barbershop.description}
      />
    </List.Item>
  );
}

function InactiveBarbershops(props) {
  const { inactiveBarbershops, setReloadBarbershops, showDeleteConfirm } = props;
  return (
    <List
      className="items-active"
      itemLayout="horizontal"
      dataSource={inactiveBarbershops}
      renderItem={(barbershop) => (
        <BarbershopInactiveItem
          barbershop={barbershop}
          setReloadBarbershops={setReloadBarbershops}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function BarbershopInactiveItem(props) {
  const { barbershop, setReloadBarbershops, showDeleteConfirm } = props;
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (barbershop.logo) {
      getLogoApi(barbershop.logo).then((response) => {
        setLogo(response);
      });
    } else {
      setLogo(null);
    }
  }, [barbershop]);

  const activateBarbershop = () => {
    const accessToken = getAccessTokenApi();
    activateBarbershopApi(accessToken, barbershop._id, true)
    .then((response) => {
        setReloadBarbershops(true);
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
    showDeleteConfirm(barbershop);
  };

  return (
    <List.Item
      actions={[
        <Tooltip placement="top" title="Activar" color="#133046">
          <Button type="primary" onClick={activateBarbershop}>
            <CheckOutlined />
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
        avatar={<Avatar src={logo ? logo : NoAvatar} />}
        title={`${barbershop.name ? barbershop.name : "..."}`}
        description={barbershop.description}
      />
    </List.Item>
  );
}
