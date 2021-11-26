import React from "react";
import {Modal as ModalAntd} from "antd";


export default function Modal(props){
    const {children, title, isVisible, setModalVisible}= props;

    return (
      <ModalAntd
        title={title}
        centered
        visible={isVisible}
        onCancel={() => setModalVisible(false)}
        footer={false}
      >
        {children}
      </ModalAntd>
    );
}