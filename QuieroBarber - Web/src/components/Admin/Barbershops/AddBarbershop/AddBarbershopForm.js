import React, { useState } from "react";
import { Form, Input, Button, Row, Col, notification } from "antd";
import { addBarbershopApi } from "../../../../api/barbershop";
import { getAccessTokenApi } from "../../../../api/auth";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import "./AddBarbershopForm.scss";

export default function AddBarbershopForm(props) {
  const { setModalVisible, setReloadBarbershops } = props;

  const [barbershopData, setBarbershopData] = useState({});

  const addBarbershop = (e) => {
    e.preventDefault();

    if (
      !barbershopData.name ||
      !barbershopData.description ||
      !barbershopData.address ||
      !barbershopData.phone ||
      !barbershopData.lat ||
      !barbershopData.lng
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else {
      const accessToken = getAccessTokenApi();
      addBarbershopApi(accessToken, barbershopData)
        .then((response) => {
          notification["success"]({
            message: response.message,
          });
          setBarbershopData({
            name: "",
            description: "",
            address: "",
            phone: "",
            lat: "",
            lng: "",
          });
          setModalVisible(false);
          setReloadBarbershops(true);
        })
        .catch((err) => {
          notification["error"]({
            message: err,
          });
        });
    }
  };

  return (
    <div className="add-barbershop-form">
      <AddForm
        barbershopData={barbershopData}
        setBarbershopData={setBarbershopData}
        addBarbershop={addBarbershop}
      />
    </div>
  );
}

function AddForm(props) {
  const { barbershopData, setBarbershopData, addBarbershop } = props;

  return (
    <Form className="form-add" onSubmitCapture={addBarbershop}>
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
                setBarbershopData({ ...barbershopData, description: e.target.value })
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
                setBarbershopData({ ...barbershopData, address: e.target.value })
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
                setBarbershopData({ ...barbershopData, phone: e.target.value })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row glutter={24}>
        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<LockOutlined />}
              placeholder="Latitud"
              value={barbershopData.lat}
              onChange={(e) =>
                setBarbershopData({ ...barbershopData, lat: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<LockOutlined />}
              placeholder="Longitud"
              value={barbershopData.lng}
              onChange={(e) =>
                setBarbershopData({ ...barbershopData, lng: e.target.value })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-submit">
          Crear Barbería
        </Button>
      </Form.Item>
    </Form>
  );
}
