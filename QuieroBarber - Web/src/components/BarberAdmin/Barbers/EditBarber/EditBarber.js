import React, { useState, useCallback, useEffect } from "react";
import {
  Avatar,
  Form,
  Input,
  Button,
  Row,
  Col,
  notification,
  TimePicker,
} from "antd";
import { useDropzone } from "react-dropzone";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import { UserOutlined, MessageOutlined, TeamOutlined } from "@ant-design/icons";
import {
  uploadAvatarApi,
  updateBarberApi,
  getAvatarApi,
} from "../../../../api/barber";
import { getAccessTokenApi } from "../../../../api/auth";
import moment from "moment";

import "./EditBarber.scss";

export default function EditBarber(props) {
  const { barber, setModalVisible, setReloadBarbers } = props;
  const [avatar, setAvatar] = useState(null);
  const [barberData, setBarberData] = useState({});
  console.log(barberData.from);
  console.log(barberData.until);
  console.log(moment(`${barberData.until}`, "HH:mm").isValid());

  useEffect(() => {
    setBarberData({
      name: barber.name,
      lastName: barber.lastName,
      description: barber.description,
      aka: barber.aka,
      avatar: barber.avatar,
      from: moment(barber.from).format("HH:mm"),
      until: moment(barber.until).format("HH:mm"),
    });
  }, [barber]);

  useEffect(() => {
    if (barber.avatar) {
      getAvatarApi(barber.avatar).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [barber]);

  useEffect(() => {
    if (avatar) {
      setBarberData({ ...barberData, avatar: avatar.file });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar]);

  const updateBarber = (e) => {
    e.preventDefault();
    const token = getAccessTokenApi();
    let barberUpdate = barberData;

    if (
      !barberUpdate.name ||
      !barberUpdate.lastName ||
      !barberUpdate.description ||
      !barberUpdate.aka
    ) {
      notification["error"]({
        message:
          "Los campos Nombre, Apellido, Descripción y Alias son obligatorios.",
      });
      return;
    }
    if (typeof barberUpdate.avatar === "object") {
      uploadAvatarApi(token, barberUpdate.avatar, barber._id).then(
        (response) => {
          barberUpdate.avatar = response.avatarName;
          updateBarberApi(token, barberUpdate, barber._id).then((result) => {
            notification["success"]({
              message: result,
            });
            setModalVisible(false);
            setReloadBarbers(true);
          });
        }
      );
    } else {
      updateBarberApi(token, barberUpdate, barber._id).then((result) => {
        notification["success"]({
          message: result.message,
        });
        setModalVisible(false);
        setReloadBarbers(true);
      });
    }
  };

  return (
    <div className="edit-barber-form">
      <UploadAvatar avatar={avatar} setAvatar={setAvatar} />
      <EditForm
        barberData={barberData}
        setBarberData={setBarberData}
        updateBarber={updateBarber}
      />
    </div>
  );
}

function UploadAvatar(props) {
  const { avatar, setAvatar } = props;
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (avatar) {
      if (avatar.preview) {
        setAvatarUrl(avatar.preview);
      } else {
        setAvatarUrl(avatar);
      }
    } else {
      setAvatarUrl(null);
    }
  }, [avatar]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setAvatar({ file, preview: URL.createObjectURL(file) });
    },
    [setAvatar]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  return (
    <div className="upload-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Avatar size={150} src={NoAvatar} />
      ) : (
        <Avatar size={150} src={avatarUrl ? avatarUrl : NoAvatar} />
      )}
    </div>
  );
}

function EditForm(props) {
  const { barberData, setBarberData, updateBarber } = props;

  const { TextArea } = Input;
  const format = "HH:mm";

  return (
    <Form className="form-edit" onSubmitCapture={updateBarber}>
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
                setBarberData({
                  ...barberData,
                  lastName: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<MessageOutlined />}
              placeholder="Alias"
              value={barberData.aka}
              onChange={(e) =>
                setBarberData({
                  ...barberData,
                  aka: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<MessageOutlined />}
              placeholder="Alias"
              value={barberData.aka}
              onChange={(e) =>
                setBarberData({
                  ...barberData,
                  aka: e.target.value,
                })
              }
            />
          </Form.Item>
          {moment(`${barberData.from}`, "HH:mm").isValid() ? (
            <Form.Item>
              <TimePicker
                className="time-picker"
                minuteStep={30}
                placeholder="Horario entrada"
                defaultValue={moment(`${barberData.from}`, format)}
                format={format}
                onChange={(time, timeString) =>
                  setBarberData({
                    ...barberData,
                    from: moment(time, format).toDate(),
                  })
                }
              />
            </Form.Item>
          ) : (
            <></>
          )}
          {moment(`${barberData.until}`, "HH:mm").isValid() ? (
            <Form.Item>
              <TimePicker
                className="time-picker"
                minuteStep={30}
                placeholder="Horario finalización"
                defaultValue={moment(`${barberData.until}`, format)}
                format={format}
                onChange={(time, timeString) =>
                  setBarberData({
                    ...barberData,
                    until: moment(time, format).toDate(),
                  })
                }
              />
            </Form.Item>
          ) : (
            <></>
          )}
          <Form.Item>
            <TextArea
              placeholder="Descripción"
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={barberData.description}
              onChange={(e) =>
                setBarberData({
                  ...barberData,
                  description: e.target.value,
                })
              }
            />
          </Form.Item>
        </Col>
        <Col span={4}></Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-submit">
          Actualizar Barbero
        </Button>
      </Form.Item>
    </Form>
  );
}
