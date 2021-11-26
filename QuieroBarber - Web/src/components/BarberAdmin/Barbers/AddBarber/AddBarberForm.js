import React, { useState } from "react";
import { Form, Input, Button, Row, Col, notification, TimePicker } from "antd";
import { addBarberApi } from "../../../../api/barber";
import { getAccessTokenApi } from "../../../../api/auth";
import { UserOutlined, MessageOutlined, TeamOutlined } from "@ant-design/icons";
import useBarbershop from "../../../../hooks/useBarbershop";
import moment from "moment";

import "./AddBarberForm.scss";

export default function AddBarberForm(props) {
  const barbershop = useBarbershop();
  const { setModalVisible, setReloadBarbers } = props;

  const [barberData, setBarberData] = useState({});

  const addBarber = (e) => {
    e.preventDefault();
    console.log(barberData.from);
    if (
      !barberData.name ||
      !barberData.lastName ||
      !barberData.description ||
      !barberData.aka ||
      barberData.from === "" ||
      barberData.from === undefined ||
      barberData.until === "" ||
      barberData.until === undefined
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else {
      const accessToken = getAccessTokenApi();
      addBarberApi(accessToken, barberData, barbershop)
        .then((response) => {
          notification["success"]({
            message: response,
          });
          setBarberData({
            name: "",
            lastName: "",
            description: "",
            aka: "",
            from: "",
            until: "",
          });
          setModalVisible(false);
          setReloadBarbers(true);
        })
        .catch((err) => {
          notification["error"]({
            message: err,
          });
        });
    }
  };

  return (
    <div className="add-barber-form">
      <AddForm
        barberData={barberData}
        setBarberData={setBarberData}
        addBarber={addBarber}
      />
    </div>
  );
}

function AddForm(props) {
  const { barberData, setBarberData, addBarber } = props;

  const { TextArea } = Input;
  const format = "HH:mm";

  return (
    <Form className="form-add" onSubmitCapture={addBarber}>
      <Row glutter={24}>
        <Col span={4}></Col>
        <Col span={16}>
          <Form.Item>
            <Input
              prefix={<UserOutlined />}
              placeholder="Nombre"
              value={barberData.name}
              onChange={(e) =>
                setBarberData({ ...barberData, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<TeamOutlined />}
              placeholder="Apellido"
              value={barberData.lastName}
              onChange={(e) =>
                setBarberData({ ...barberData, lastName: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<MessageOutlined />}
              placeholder="Apodo"
              value={barberData.aka}
              onChange={(e) =>
                setBarberData({ ...barberData, aka: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <TimePicker
              className="time-picker"
              minuteStep={30}
              placeholder="Horario entrada"
              format={format}
              onChange={(time, timeString) =>
                setBarberData({
                  ...barberData,
                  from: moment(time, format).toDate(),
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <TimePicker
              className="time-picker"
              minuteStep={30}
              placeholder="Horario finalización"
              format={format}
              onChange={(time, timeString) =>
                setBarberData({
                  ...barberData,
                  until: moment(time, format).toDate(),
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Descripción"
              value={barberData.description}
              onChange={(e) =>
                setBarberData({ ...barberData, description: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={4}></Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-submit">
          Crear Barbero
        </Button>
      </Form.Item>
    </Form>
  );
}
