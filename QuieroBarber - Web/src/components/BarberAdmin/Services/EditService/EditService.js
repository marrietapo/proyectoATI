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
import {
  PicLeftOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import {
  uploadImageApi,
  updateServiceApi,
  getImageApi,
} from "../../../../api/service";
import { getAccessTokenApi } from "../../../../api/auth";

import "./EditService.scss";

export default function EditService(props) {
  const { service, setModalVisible, setReloadServices } = props;
  const [image, setImage] = useState(null);
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    setServiceData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image,
    });
  }, [service]);

  useEffect(() => {
    if (service.image) {
      getImageApi(service.image).then((response) => {
        setImage(response);
      });
    } else {
      setImage(null);
    }
  }, [service]);

  useEffect(() => {
    if (image) {
      setServiceData({ ...serviceData, image: image.file });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const updateService = (e) => {
    e.preventDefault();
    const token = getAccessTokenApi();
    let serviceUpdate = serviceData;

    if (
      !serviceUpdate.name ||
      !serviceUpdate.description ||
      !serviceUpdate.price ||
      !serviceUpdate.duration 
    ) {
      notification["error"]({
        message:
          "Los campos Nombre, Apellido, Descripción y Alias son obligatorios.",
      });
      return;
    }
    if (typeof serviceUpdate.image === "object") {

      uploadImageApi(token, serviceUpdate.image, service._id).then((response) => {
        serviceUpdate.image = response.imageName;
        updateServiceApi(token, serviceUpdate, service._id).then((result) => {
          notification["success"]({
            message: result.message,
          });
          setModalVisible(false);
          setReloadServices(true);
        });
      });
    } else {
      updateServiceApi(token, serviceUpdate, service._id).then((result) => {
        notification["success"]({
          message: result.message,
        });
        setModalVisible(false);
        setReloadServices(true);
      });
    }
  };

  return (
    <div className="edit-service-form">
      <UploadImage image={image} setImage={setImage} />
      <EditForm
        serviceData={serviceData}
        setServiceData={setServiceData}
        updateService={updateService}
      />
    </div>
  );
}

function UploadImage(props) {
  const { image, setImage } = props;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (image) {
      if (image.preview) {
        setImageUrl(image.preview);
      } else {
        setImageUrl(image);
      }
    } else {
      setImageUrl(null);
    }
  }, [image]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage({ file, preview: URL.createObjectURL(file) });
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  return (
    <div className="upload-image" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Avatar size={150} src={NoAvatar} />
      ) : (
        <Avatar size={150} src={imageUrl ? imageUrl : NoAvatar} />
      )}
    </div>
  );
}

function EditForm(props) {
  const { serviceData, setServiceData, updateService } = props;

  const { TextArea } = Input;

  return (
    <Form className="form-edit" onSubmitCapture={updateService}>
      <Row glutter={24}>
        <Col span={4}></Col>
        <Col span={16}>
          <Form.Item>
            <Input
              prefix={<PicLeftOutlined />}
              placeholder="Nombre"
              value={serviceData.name}
              onChange={(e) =>
                setServiceData({ ...serviceData, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<DollarCircleOutlined />}
              placeholder="Precio"
              value={serviceData.price}
              onChange={(e) =>
                setServiceData({ ...serviceData, price: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<ClockCircleOutlined />}
              placeholder="Duración"
              value={serviceData.duration}
              onChange={(e) =>
                setServiceData({ ...serviceData, duration: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Descripción"
              value={serviceData.description}
              onChange={(e) =>
                setServiceData({ ...serviceData, description: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={4}></Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-submit">
          Actualizar Servicio
        </Button>
      </Form.Item>
    </Form>
  );
}