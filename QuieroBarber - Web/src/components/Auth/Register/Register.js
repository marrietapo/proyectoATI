import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  minLengthValidation,
  emailValidation,
} from "../../../utils/formValidation";
import {signUpAdminApi } from "../../../api/user";

import "./Register.scss";

export default function Register() {
  const [input, setInput] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    privacyPolicy: false,
  });

  const [formValid, setFormValid] = useState({
    name: false,
    lastName: false,
    email: false,
    password: false,
    repeatPassword: false,
    privacyPolicy: false,
  });

  const changeForm = (event) => {
    if (event.target.name === "privacyPolicy") {
      setInput({
        ...input,
        [event.target.name]: event.target.checked,
      });
    } else {
      setInput({
        ...input,
        [event.target.name]: event.target.value,
      });
    }
  };

  //validación de los inputs según su tipo
  const inputValidation = (event) => {
    const { type, name } = event.target;
    if (type === "text") {
      setFormValid({
        ...formValid,
        [name]: minLengthValidation(event.target, 3),
      });
    }
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
    if (type === "checkbox") {
      setFormValid({
        ...formValid,
        [name]: event.target.checked,
      });
    }
  };

  const register = async (ev) => {
    ev.preventDefault();
    const { name, lastName, email } =
      formValid;
    const nameValue = input.name;
    const lastNameValue = input.lastName;
    const emailValue = input.email;
    const passwordValue = input.password;
    const repeatPasswordValue = input.repeatPassword;
    const privacyPolicyValue = input.privacyPolicy;

    if (
      !nameValue ||
      !lastNameValue ||
      !emailValue ||
      !passwordValue ||
      !repeatPasswordValue
    ) {
      notification["error"]({
        message: "Todos los campos son obligatorios.",
      });
    } else if (!name) {
      notification["error"]({
        message: "Nombre con cantidad de caracteres insuficientes.",
      });
    } else if (!lastName) {
      notification["error"]({
        message: "Apellido con cantidad de caracteres insuficientes.",
      });
    } else if (!email) {
      notification["error"]({
        message: "Correo electrónico inválido.",
      });
    } else if (!privacyPolicyValue) {
      notification["error"]({
        message: "Debe aceptar la política de privacidad.",
      });
    } else {
      if (passwordValue !== repeatPasswordValue) {
        notification["error"]({
          message: "Las contraseñas no coinciden.",
        });
      } else {
        const res = await signUpAdminApi(input);
        if (res.user) {
          notification["success"]({
            message: res.message,
          });
          resetForm();
        } else {
          notification["error"]({
            message: res.message,
          });
        }
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
      name: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      privacyPolicy: false,
    });

    setFormValid({
      name: false,
      lastName: false,
      email: false,
      password: false,
      repeatPassword: false,
      privacyPolicy: false,
    });
  };

  return (
    <Form
      className="register-form"
      onChange={changeForm}
      onSubmitCapture={register}
    >
      <Form.Item>
        <Input
          prefix={<UserOutlined className="register-form_icon" />}
          type="text"
          name="name"
          placeholder="Nombre"
          className="register-form_input"
          onChange={inputValidation}
          value={input.name}
        />
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<UserOutlined className="register-form_icon" />}
          type="text"
          name="lastName"
          placeholder="Apellido"
          className="register-form_input"
          onChange={inputValidation}
          value={input.lastName}
        />
      </Form.Item>
      <Form.Item>
        <Input
          prefix={
            <MailOutlined
              className="register-form_icon"
              style={{ backgroundColor: "transparent" }}
            />
          }
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="register-form_input"
          onChange={inputValidation}
          value={input.email}
        ></Input>
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<LockOutlined className="register-form_icon" />}
          type="password"
          name="password"
          placeholder="Contraseña"
          className="register-form_input"
          onChange={inputValidation}
          value={input.password}
        />
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<LockOutlined className="register-form_icon" />}
          type="password"
          name="repeatPassword"
          placeholder="Repetir contraseña"
          className="register-form_input"
          onChange={inputValidation}
          value={input.repeatPassword}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox
          name="privacyPolicy"
          className="register-form_checkbox"
          onChange={inputValidation}
          checked={input.privacyPolicy}
        >
          He leído y acepto la política de privacidad
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" className="register-form_button">
          Registrarme
        </Button>
      </Form.Item>
    </Form>
  );
}
