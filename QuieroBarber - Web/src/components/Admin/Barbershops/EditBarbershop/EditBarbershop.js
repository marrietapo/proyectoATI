import React, { useState, useCallback, useEffect } from "react";
import {
  Avatar,
  Form,
  Input,
  Button,
  Row,
  Col,
  notification,
} from "antd";
import { useDropzone } from "react-dropzone";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import {
  uploadLogoApi,
  updateBarbershopApi,
  getLogoApi,
} from "../../../../api/barbershop";
import { getAccessTokenApi } from "../../../../api/auth";

import "./EditBarbershop.scss";

export default function EditBarbershop(props) {
  const { barbershop, setModalVisible, setReloadBarbershops } = props;
  const [logo, setLogo] = useState(null);
  const [barbershopData, setBarbershopData] = useState({});

  useEffect(() => {
    setBarbershopData({
      name: barbershop.name,
      description: barbershop.description,
      address: barbershop.address,
      phone: barbershop.phone,
      logo: barbershop.logo,
    });
  }, [barbershop]);

  useEffect(() => {
    if (barbershop.logo) {
      getLogoApi(barbershop.logo).then((response) => {
        setLogo(response);
      });
    } else {
      setLogo(null);
    }
  }, [barbershop]);

  useEffect(() => {
    if (logo) {
      setBarbershopData({ ...barbershopData, logo: logo.file });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo]);

  const updateBarbershop = (e) => {
    e.preventDefault();
    const token = getAccessTokenApi();
    let barbershopUpdate = barbershopData;

    if (
      !barbershopUpdate.name ||
      !barbershopUpdate.description ||
      !barbershopUpdate.address ||
      !barbershopUpdate.phone
    ) {
      notification["error"]({
        message:
          "Los campos Nombre, Descripción, Teléfono y Dirección son obligatorios.",
      });
      return;
    }
    if (typeof barbershopUpdate.logo === "object") {
      uploadLogoApi(token, barbershopUpdate.logo, barbershop._id).then((response) => {
        barbershopUpdate.logo = response.logoName;
        updateBarbershopApi(token, barbershopUpdate, barbershop._id).then((result) => {
          notification["success"]({
            message: result.message,
          });
          setModalVisible(false);
          setReloadBarbershops(true);
        });
      });
    } else {
      updateBarbershopApi(token, barbershopUpdate, barbershop._id).then((result) => {
        notification["success"]({
          message: result.message,
        });
        setModalVisible(false);
        setReloadBarbershops(true);
      });
    }
  };

  return (
    <div className="edit-barbershop-form">
      <UploadLogo logo={logo} setLogo={setLogo} />
      <EditForm
        barbershopData={barbershopData}
        setBarbershopData={setBarbershopData}
        updateBarbershop={updateBarbershop}
      />
    </div>
  );
}

function UploadLogo(props) {
  const { logo, setLogo } = props;
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    if (logo) {
      if (logo.preview) {
        setLogoUrl(logo.preview);
      } else {
        setLogoUrl(logo);
      }
    } else {
      setLogoUrl(null);
    }
  }, [logo]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setLogo({ file, preview: URL.createObjectURL(file) });
    },
    [setLogo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  return (
    <div className="upload-logo" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Avatar size={150} src={NoAvatar} />
      ) : (
        <Avatar size={150} src={logoUrl ? logoUrl : NoAvatar} />
      )}
    </div>
  );
}

function EditForm(props) {
  const { barbershopData, setBarbershopData, updateBarbershop } = props;

  return (
    <Form className="form-edit" onSubmitCapture={updateBarbershop}>
      <Row glutter={24}>
        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<UserOutlined />}
              placeholder="Nombre"
              value={barbershopData.name}
              onChange={(e) =>
                setBarbershopData({ ...barbershopData, name: e.target.value })
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<UserOutlined />}
              placeholder="Descripción"
              value={barbershopData.description}
              onChange={(e) =>
                setBarbershopData({
                  ...barbershopData,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row glutter={24}>
        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<MailOutlined />}
              placeholder="Dirección"
              value={barbershopData.address}
              onChange={(e) =>
                setBarbershopData({
                  ...barbershopData,
                  address: e.target.value,
                })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<MailOutlined />}
              placeholder="Teléfono"
              value={barbershopData.phone}
              onChange={(e) =>
                setBarbershopData({
                  ...barbershopData,
                  phone: e.target.value,
                })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-submit">
          Actualizar Barbería
        </Button>
      </Form.Item>
    </Form>
  );
}