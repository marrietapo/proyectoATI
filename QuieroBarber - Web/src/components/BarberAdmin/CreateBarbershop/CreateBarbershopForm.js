import React, { useState, useEffect } from "react";
import {
  FileDoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps, Button, notification } from "antd";
import PickUpLocation from "./PickUpLocation";
import EntryData from "./EntryData";
import AddBarbershopAdmin from "./AddBarbershopAdmin";
import {
  addBarbershopWithAdminApi,
  uploadLogoApi,
} from "../../../api/barbershop";
import { getAccessTokenApi } from "../../../api/auth";

import "./CreateBarbershopForm.scss";

export default function CreateBarbershopForm() {
  const [avatar, setAvatar] = useState("");
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({
    name: "",
    description: "",
    phone: "",
    child: "",
    coffee: "",
    logo: "",
  });

  const [userData, setUserData] = useState({
      name: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      repeatPassword: "",
    });

  const [locationData, setLocationData] = useState({
    coords: { longitud: "", latitud: "" },
    address: "",
  });

  useEffect(() => {
    if (avatar) {
      setData({ ...data, logo: avatar.file });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar]);

  const { Step } = Steps;

  const steps = [
    {
      title: "Información General",
      icon: <FileDoneOutlined />,
      content: (
        <EntryData
          data={data}
          setData={setData}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      ),
    },
    {
      title: "Ubicación",
      icon: <EnvironmentOutlined />,
      content: (
        <PickUpLocation
          locationData={locationData}
          setLocationData={setLocationData}
        />
      ),
    },
    {
      title: "Propietario",
      icon: <UserOutlined />,
      content: (
        <AddBarbershopAdmin userData={userData} setUserData={setUserData} />
      ),
    },
  ];

  const handleData = () => {
    if (data.name===""||data.description===""||data.phone===""||locationData.address===""||locationData.coords.latitud==="" || locationData.coords.longitud==="") {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else {
      const accessToken = getAccessTokenApi();
      const requestBody = {
        name: data.name,
        description: data.description,
        phone: data.phone,
        address: locationData.address,
        geo: {
          lat: locationData.coords.latitud,
          lng: locationData.coords.longitud,
        },
        userName:userData.name,
        userLastName:userData.lastName,
        userEmail:userData.email,
        userPassword:userData.password,
        userRepeatPassword:userData.repeatPassword,
      };

      if(data.logo !==""){
        addBarbershopWithAdminApi(accessToken, requestBody).then((response) => {
          notification["success"]({
            message: response.message,
          });
          uploadLogoApi(accessToken, data.logo, response.barbershop._id).then(
            (response) => {
              notification["success"]({
                message: response.message
              });
            }
          );
        });
      }
      
      clearData();
    }
  };


  const clearData =()=>{
    setData({
      name: "",
      description: "",
      phone: "",
    });
    setLocationData({
      address: "",
      coords: { longitud: "", latitud: "" },
    });
    setUserData({
      name: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      repeatPassword: "",
    })
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };


  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current > 0 && (
          <Button style={{ margin: "20px 8px" }} onClick={() => prev()}>
            Anterior
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            style={{ margin: "20px 0px" }}
            type="primary"
            onClick={() => next()}
          >
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            style={{ margin: "20px 0px" }}
            type="primary"
            onClick={handleData}
          >
            Finalizar
          </Button>
        )}
      </div>
    </>
  );
}
