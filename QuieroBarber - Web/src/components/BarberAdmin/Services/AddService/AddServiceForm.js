import React, { useState } from "react";
import { Form, Input,  Button, Row, Col, notification } from "antd";
import { addServiceApi } from "../../../../api/service";
import { getAccessTokenApi } from "../../../../api/auth";
import {
  PicLeftOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import useBarbershop from "../../../../hooks/useBarbershop";


import "./AddServiceForm.scss";

export default function AddServiceForm(props) {
  const { setModalVisible, setReloadServices } = props;
  const barbershop = useBarbershop();
  const [serviceData, setServiceData] = useState({});

  const addService = (e) => {
    e.preventDefault();

    if (
      !serviceData.name ||
      !serviceData.description ||
      !serviceData.price ||
      !serviceData.duration
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else {
      const accessToken = getAccessTokenApi();
      addServiceApi(accessToken, serviceData, barbershop)
        .then((response) => {
          console.log(response)
          notification["success"]({
            message: response,
          });
          setServiceData({
            name: "",
            description: "",
            price: "",
            duration: "",
          });
          setModalVisible(false);
          setReloadServices(true);
        })
        .catch((err) => {
          notification["error"]({
            message: err,
          });
        });
    }
  };

  return (
    <div className="add-service-form">
      <AddForm
        serviceData={serviceData}
        setServiceData={setServiceData}
        addService={addService}
      />
    </div>
  );
}

function AddForm(props) {
  const { serviceData, setServiceData, addService } = props;

  const { TextArea } = Input;

  return (
    <Form className="form-add" onSubmitCapture={addService}>
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
          Crear Servicio
        </Button>
      </Form.Item>
    </Form>
  );
}
