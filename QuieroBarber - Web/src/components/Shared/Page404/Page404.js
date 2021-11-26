import React from 'react';
import { Result } from "antd";

export default function Page404() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Disculpas, la página no está disponible."
      />
    );
}
