import React from "react";
import { Input, Row, Col, Form} from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import UploadAvatar from "../../../Shared/UploadAvatar";

import "./EntryData.scss"; 

export default function EntryData(props) {
  const {data, setData, avatar, setAvatar} = props;

  const onFormLayoutChange=()=>{
    
  }
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const { TextArea } = Input;

  return (
    <>
      <Row>
        <Col span={24}>
          <UploadAvatar avatar={avatar} setAvatar={setAvatar} />

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
              label="Nombre"
              rules={[{ required: true, message: "Ingrese un Nombre" }]}
            >
              <Input
                prefix={<UserOutlined className="register-form_icon" />}
                type="text"
                name="name"
                placeholder="Nombre"
                className="register-form_input"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item
              label="Teléfono"
              rules={[{ required: true, message: "Ingrese un teléfono" }]}
            >
              <Input
                prefix={<MailOutlined className="register-form_icon" />}
                type="text"
                name="phone"
                placeholder="Teléfono"
                className="register-form_input"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              ></Input>
            </Form.Item>
            <Form.Item
              label="Descripción"
              rules={[{ required: true, message: "Ingrese una descripción" }]}
            >
              <TextArea
                prefix={<UserOutlined className="register-form_icon" />}
                name="description"
                className="register-form_textarea"
                placeholder="Ingrese una descripción"
                autoSize={{ minRows: 4, maxRows: 8 }}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
