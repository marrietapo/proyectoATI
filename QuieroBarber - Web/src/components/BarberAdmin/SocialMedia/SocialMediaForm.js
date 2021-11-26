import React, {useState} from "react";
import { Input, Row, Col, Form, Select } from "antd";
import {
  YoutubeOutlined,
  TwitterOutlined,
  FacebookOutlined,
  InstagramOutlined,
  CloudOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

import "./SocialMediaForm.scss"; 

export default function SocialMediaForm(props) {
  const { myBarbershop, setMyBarbershop } = props;
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    web: "",
    whatsapp: "",
  });
  
  if(myBarbershop && myBarbershop.media!== undefined){
    setSocialMedia(myBarbershop.media);
  }


  const { Option } = Select;


  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const selectBefore = (
  <Select defaultValue="http://" className="select-before">
    <Option value="http://">http://</Option>
    <Option value="https://">https://</Option>
  </Select>
  )


    const handle= ()=>{
      console.log("object")
    }

  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        size="large"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="form"
      >
        <Row>
          <Col span={4} className="row"></Col>
          <Col span={18} className="row">
            <Form.Item label="">
              <Input
                addonBefore="https://www.instagram.com/"
                addonAfter={<InstagramOutlined className="social-form_icon" />}
                type="text"
                name="name"
                placeholder="Instagram"
                className="social-form_input"
                value={socialMedia.instagram}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, instagram: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="">
              <Input
                addonBefore="https://www.facebook.com/"
                addonAfter={<FacebookOutlined className="social-form_icon" />}
                type="text"
                name="facebook"
                placeholder="Facebook"
                className="social-form_input"
                value={socialMedia.facebook}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, facebook: e.target.value })
                }
              ></Input>
            </Form.Item>

            <Form.Item label="">
              <Input
                addonBefore="https://www.youtube.com/"
                addonAfter={<YoutubeOutlined className="social-form_icon" />}
                type="text"
                name="youtube"
                placeholder="Youtube"
                className="social-form_input"
                value={socialMedia.youtube}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, youtube: e.target.value })
                }
              ></Input>
            </Form.Item>
            <Form.Item label="">
              <Input
                addonBefore="https://twitter.com/"
                addonAfter={<TwitterOutlined className="social-form_icon" />}
                type="text"
                name="twitter"
                placeholder="Twitter"
                className="social-form_input"
                value={socialMedia.twitter}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, twitter: e.target.value })
                }
              ></Input>
            </Form.Item>

            <Form.Item label="">
              <Input
                addonBefore={selectBefore}
                addonAfter={<CloudOutlined className="social-form_icon" />}
                type="text"
                name="web"
                placeholder="Web"
                className="social-form_input"
                value={socialMedia.web}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, web: e.target.value })
                }
              ></Input>
            </Form.Item>

            <Form.Item label="">
              <Input
                addonBefore="https://wa.me/598"
                addonAfter={
                  <WhatsAppOutlined
                    className="social-form_icon"
                    onClick={() => handle()}
                  />
                }
                type="text"
                name="whatsapp"
                placeholder="Whatsapp"
                className="social-form_input"
                value={socialMedia.whatsapp}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, whatsapp: e.target.value })
                }
              ></Input>
            </Form.Item>
          </Col>
          <Col span={4} className="row"></Col>
        </Row>
      </Form>
    </>
  );
}
