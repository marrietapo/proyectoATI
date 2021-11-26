import React, {useState} from "react";
import {Form, Input, Button, notification} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signInApi } from "../../../api/user";
import {
  minLengthValidation,
  emailValidation,
} from "../../../utils/formValidation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../utils/constants";


import "./Login.scss";

export default function Login(){
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [formValid, setFormValid] = useState({
    email: false,
    password: false,
  });

  const changeForm = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };

  //validación de los inputs según su tipo
  const inputValidation = (event) => {
    const { type, name } = event.target;
    if (type === "email") {
      setFormValid({
        ...formValid,
        [name]: emailValidation(event.target),
      });
    }
    if (type === "password") {
      setFormValid({
        ...formValid,
        [name]: minLengthValidation(event.target, 8),
      });
    }
    }
 

  const login = async (ev) => {
    ev.preventDefault();
    const email = input.email;
    const password = input.password;
    const emailValid = formValid.email;
    const passwordValid = formValid.password;

    if (!email || !password) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else if (!emailValid) {
      notification["error"]({
        message: "Correo electrónico inválido.",
      });
    } else if (!passwordValid) {
      notification["error"]({
        message: "Contraseña con cantidad de caracteres insuficientes.",
      });
    } else {
      const res = await signInApi(input);
      if (res.accessToken) {
        console.log(res);
        localStorage.setItem(ACCESS_TOKEN, res.accessToken);
        localStorage.setItem(REFRESH_TOKEN, res.refreshToken);

        notification["success"]({
          message: res.message,
        });
        resetForm();
        window.location.href= "/";
      } else {
        notification["error"]({
          message: res.message,
        });
      }
    }
  };

  const resetForm = () => {
    const inputs = document.getElementsByTagName("input");
    //remover clases con colores
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].classList.remove("success");
      inputs[i].classList.remove("error");
    }

    setInput({
    //  email: "",
      password: "",
    });

    setFormValid({
      email: false,
      password: false,
    });
  };


  return (
    <Form className="login-form" onChange={changeForm} onSubmitCapture={login}>
      <Form.Item>
        <Input
          prefix={
            <MailOutlined
              className="login-form_icon"
              style={{ backgroundColor: "transparent" }}
            />
          }
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="login-form_input"
          onChange={inputValidation}
          value={input.email}
        ></Input>
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<LockOutlined className="login-form_icon" />}
          type="password"
          name="password"
          placeholder="Contraseña"
          className="login-form_input"
          onChange={inputValidation}
          value={input.password}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" className="login-form_button">
          Ingresar
        </Button>
      </Form.Item>
    </Form>
  );
}