import React, {useState} from "react";
import { Input, Row, Col, Form, Button, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {sendNotificationForAll} from "../../../../api/notification";
import {getAccessTokenApi} from "../../../../api/auth"

import "./NotificationForm.scss";

export default function NotificationForm(props) {

  const [data, setData] = useState({title:"", message:""});
  const token = getAccessTokenApi();

  const onFormLayoutChange = () => {};

  
  const sendNotification = (e) => {
    //console.log(token);
    e.preventDefault();
    if (
      data.title==="" ||
      data.message===""
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else {
      //console.log(data);
      sendNotificationForAll(token, data)
      .then((response) => {
        if(response.status===200){
          notification["success"]({
            message: response.message,
          });         
          setData({ ...data, title: "", message:""} )
       }else{
        notification["error"]({
          message: response.message,
        });
       }
     }) 
    };
  }

 

  const onFinish = (values) => {
    console.log("Success:", values);    
  };

  const onFinishFailed = (errorInfo) => {    
    console.log("Failed:", errorInfo);
  };

  const { TextArea } = Input;

  return (
    <div class="register-form">
      <Form className="form-add" onSubmitCapture={sendNotification}>
        <Row>
          <Col span={24}>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onValuesChange={onFormLayoutChange}
              size="large"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Título"
                rules={[
                  {
                    required: true,
                    message: "Ingrese el título de la notificación",
                  },
                ]}
              >
                <Input
                  type="text"
                  name="name"
                  placeholder="Título de la Notificación"
                  className="register-form_input"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
              </Form.Item>
              <Form.Item
                label="Cuerpo"
                rules={[
                  {
                    required: true,
                    message: "Ingrese el cuerpo de la notificación",
                  },
                ]}
              >
                <TextArea
                  prefix={<UserOutlined className="register-form_icon" />}
                  name="message"
                  className="register-form_textarea"
                  placeholder="Ingrese el cuerpo de la notificación"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  value={data.message}
                  onChange={(e) =>
                    setData({ ...data, message: e.target.value })
                  }
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="btn-submit register-form_button"
              >
                Enviar Notificación
              </Button>
            </Form.Item>
          </Col>
          <Col span={8}></Col>
        </Row>
      </Form>
    </div>
  );
}

