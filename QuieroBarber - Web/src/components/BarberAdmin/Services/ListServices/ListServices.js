import React, { useState, useEffect } from "react";
import {
  Switch,
  List,
  Avatar,
  Tooltip,
  Button,
  Modal as ModalAntd,
  notification,
  Skeleton,
} from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import Modal from "../../../Shared/Modal";
import {
  getImageApi,
  activateServiceApi,
  deleteServiceApi,
} from "../../../../api/service";
import { getAccessTokenApi } from "../../../../api/auth";
import EditServiceForm from "../EditService";
import AddServiceForm from "../AddService";
import {
  EditOutlined,
  StopOutlined,
  DeleteOutlined,
  CheckOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import "./ListServices.scss";

const { confirm } = ModalAntd;

export default function ListServices(props) {
  const { activeServices, inactiveServices, setReloadServices, isLoading } = props;
  const [viewServicesActives, setViewServicesActives] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const addServiceModal = () => {
    setModalVisible(true);
    setModalTitle("Creando nuevo servicio");
    setModalContent(
      <AddServiceForm
        setModalVisible={setModalVisible}
        setReloadServices={setReloadServices}
      />
    );
  };

  const showDeleteConfirm = (service) => {
    const accessToken = getAccessTokenApi();
    confirm({
      title: "Eliminando servicio",
      content: `¿Está seguro que quiere eliminar el servicio ${service.name}?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        deleteServiceApi(accessToken, service._id)
          .then((response) => {
            setReloadServices(true);
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
        <Skeleton avatar active paragraph={{ rows: 2 }} />
        <Skeleton avatar active paragraph={{ rows: 2 }} />
      </>
    );
  } else {
  return (
    <div className="list-items">
      <div className="list-items_header">
        <div className="list-items_header-switch">
          <Switch
            defaultChecked
            onChange={() => setViewServicesActives(!viewServicesActives)}
          />
          <span>
            {viewServicesActives ? "Servicios Activos" : "Servicios Inactivos"}
          </span>
        </div>
        <Button
          type="primary"
          onClick={addServiceModal}
          icon={<UserAddOutlined />}
        >
          Nuevo Servicio
        </Button>
      </div>

      {viewServicesActives ? (
        <ActiveServices
          activeServices={activeServices}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadServices={setReloadServices}
          showDeleteConfirm={showDeleteConfirm}
        />
      ) : (
        <InactiveServices
          inactiveServices={inactiveServices}
          setModalVisible={setModalVisible}
          setModalContent={setModalContent}
          setModalTitle={setModalTitle}
          setReloadServices={setReloadServices}
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

function ActiveServices(props) {
  const {
    activeServices,
    setModalVisible,
    setModalContent,
    setModalTitle,
    setReloadServices,
    showDeleteConfirm,
  } = props;

  const editService = (service) => {
    setModalVisible(true);
    setModalTitle(`Editar ${service.name}`);
    setModalContent(
      <EditServiceForm
        service={service}
        setModalVisible={setModalVisible}
        setReloadServices={setReloadServices}
      />
    );
  };

  return (
    <List
      className="items-active"
      itemLayout="horizontal"
      split="true"
      dataSource={activeServices}
      renderItem={(service) => (
        <ServiceActiveItem
          service={service}
          editService={editService}
          setReloadServices={setReloadServices}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function ServiceActiveItem(props) {
  const { service, editService, setReloadServices, showDeleteConfirm } = props;
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (service.image) {
      getImageApi(service.image).then((response) => {
        setImage(response);
      });
    } else {
      setImage(null);
    }
  }, [service]);

  const desactivateService = () => {
    const accessToken = getAccessTokenApi();

    activateServiceApi(accessToken, service._id, false)
      .then((response) => {
        setReloadServices(true);
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
    showDeleteConfirm(service);
  };

  return (
    <List.Item
      actions={[
        <Tooltip placement="top" title="Editar" color="#133046">
          <Button type="primary" onClick={() => editService(service)}>
            <EditOutlined />
          </Button>
        </Tooltip>,
        <Tooltip placement="top" title="Desactivar" color="#133046">
          <Button type="danger" onClick={desactivateService}>
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
        avatar={<Avatar src={image ? image : NoAvatar} />}
        title={service.name}
        description={service.description}
      />
    </List.Item>
  );
}

function InactiveServices(props) {
  const { inactiveServices, setReloadServices, showDeleteConfirm } = props;
  return (
    <List
      className="items-active"
      itemLayout="horizontal"
      dataSource={inactiveServices}
      renderItem={(service) => (
        <ServiceInactiveItem
          service={service}
          setReloadServices={setReloadServices}
          showDeleteConfirm={showDeleteConfirm}
        />
      )}
    />
  );
}

function ServiceInactiveItem(props) {
  const { service, setReloadServices, showDeleteConfirm } = props;
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (service.image) {
      getImageApi(service.image).then((response) => {
        setImage(response);
      });
    } else {
      setImage(null);
    }
  }, [service]);

  const activateService = () => {
    const accessToken = getAccessTokenApi();
    activateServiceApi(accessToken, service._id, true)
      .then((response) => {
        setReloadServices(true);
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
    showDeleteConfirm(service);
  };

  return (
    <List.Item
      actions={[
        <Tooltip placement="top" title="Activar" color="#133046">
          <Button type="primary" onClick={activateService}>
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
        avatar={<Avatar src={image ? image : NoAvatar} />}
        title={`${service.name ? service.name : "..."}`}
        description={service.description}
      />
    </List.Item>
  );
}
