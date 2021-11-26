import React from "react";
import AuthProvider from "./providers/AuthProvider";
import BarbershopProvider from "./providers/BarbershopProvider";
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";



import "./App.scss";
import AppRouter from "./config/AppRouter";


function App() {

  return (
    <ConfigProvider locale={esES}>
      <AuthProvider>
        <BarbershopProvider>
        <AppRouter/>
        </BarbershopProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
