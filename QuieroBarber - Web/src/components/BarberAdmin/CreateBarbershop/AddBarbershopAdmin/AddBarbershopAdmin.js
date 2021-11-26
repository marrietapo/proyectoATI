import React from "react";
import { Form, Input, Row, Col, notification } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, TeamOutlined } from "@ant-design/icons";

import "./AddBarbershopAdmin.scss";

export default function AddUserForm(props) {
  const { userData, setUserData } = props;

  const addUser = (e) => {
    e.preventDefault();

    if (
      !userData.name ||
      !userData.lastName ||
      !userData.email ||
      !userData.password ||
      !userData.repeatPassword
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else if (userData.password !== userData.repeatPassword) {
      notification["error"]({
        message: "Las contraseñas deben ser iguales.",
      });
    } else {
    // setUserData({
    //         name: "",
    //         lastName: "",
    //         email: "",
    //         password: "",
    //         repeatPassword: "",
    //       });
    //     });
    }
  };

  return (
    <div className="add-user-form">
      <AddForm
        userData={userData}
        setUserData={setUserData}
        addUser={addUser}
      />
    </div>
  );
}

function AddForm(props) {
  const { userData, setUserData, addUser } = props;


  return (
    <Form className="form-add" onSubmitCapture={addUser}>
      <Row glutter={24}>
        <Col span={6}></Col>
        <Col span={12}>
          <Form.Item>
            <Input
              prefix={<UserOutlined className="add-user-form_icon"/>}
              placeholder="Nombre"
              value={userData.name}
                              className="add-user-form_input"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<TeamOutlined className="add-user-form_icon" />}
              placeholder="Apellido"
                              className="add-user-form_input"
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<MailOutlined  className="add-user-form_icon"/>}
              placeholder="Correo Electrónico"
              value={userData.email}
                              className="add-user-form_input"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<LockOutlined className="add-user-form_icon" />}
              placeholder="Contraseña"
              type="password"
                              className="add-user-form_input"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<LockOutlined className="add-user-form_icon" />}
              placeholder="Repetir Contraseña"
              type="password"
                              className="add-user-form_input"
              value={userData.repeatPassword}
              onChange={(e) =>
                setUserData({ ...userData, repeatPassword: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={6}></Col>
      </Row>
    </Form>
  );
}
