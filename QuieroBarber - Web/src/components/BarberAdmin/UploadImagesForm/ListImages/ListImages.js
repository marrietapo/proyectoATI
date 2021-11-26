import React, { useState, useEffect } from "react";
import {
  List,
  Button,
  Modal as ModalAntd,
  notification,
  Card,
  Skeleton,
} from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import Modal from "../../../Shared/Modal";
import { deleteUserApi } from "../../../../api/user";
import { getImageApi } from "../../../../api/barbershop";

import { getAccessTokenApi } from "../../../../api/auth";
import AddImage from "../AddImage";
import {

  UserAddOutlined
} from "@ant-design/icons";

import "./ListImages.scss";


const { confirm } = ModalAntd;


export default function ListImages(props) {

  const { myBarbershop, setMyBarbershop, setReload } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const addImageModal = ()=>{
    setModalVisible(true);
    setModalTitle("Agregando nueva imagen");
    setModalContent(
      <AddImage
        setModalVisible={setModalVisible}
        setMyBarbershop={setMyBarbershop}
        myBarbershop = {myBarbershop}
        setReload = {setReload}
      />
    );
  }

  useEffect(() => {
      setLoading(false);
    
  }, [myBarbershop])
  

  const showDeleteConfirm = (barbershop) => {
    const accessToken = getAccessTokenApi();
    confirm({
      title: "Eliminando imagen",
      content: `¿Está seguro que quiere eliminar la imagen?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        deleteUserApi(accessToken, barbershop._id)
          .then((response) => {
            notification["success"]({
              message: response,
            });
            setMyBarbershop(true);
          })
          .catch((error) => {
            notification["error"]({
              message: error,
            });
          });
      },
    });
  };


  if (loading) {
    return (
      <>
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </>
    )
  } else {
  return (
    <div className="list-users">
      <div className="list-users_header">
        <div className="list-users_header-switch"></div>
        <Button
          type="primary"
          onClick={addImageModal}
          icon={<UserAddOutlined />}
        >
          Nueva Imagen
        </Button>
      </div>
      <ShowImages
        setModalVisible={setModalVisible}
        setModalContent={setModalContent}
        setModalTitle={setModalTitle}
        setMyBarbershop={setMyBarbershop}
        showDeleteConfirm={showDeleteConfirm}
        myBarbershop={myBarbershop}
      />
      <Modal
        title={modalTitle}
        isVisible={isModalVisible}
        setModalVisible={setModalVisible}
      >
        {modalContent}
      </Modal>
    </div>
  );
}}

function ShowImages(props) {
  const {
    setModalVisible,
    setModalContent,
    setModalTitle,
    setMyBarbershop,
    showDeleteConfirm,
    myBarbershop
  } = props;
  
 

  return (
    <List
      className="users-active"
      itemLayout="horizontal"
      dataSource={myBarbershop.images}
      renderItem={(image) => (
        <>
         <ImageItem
          image={image}
          setMyBarbershop={setMyBarbershop}
          showDeleteConfirm={showDeleteConfirm}
          myBarbershop = {myBarbershop}
        />
        </>
      )}
    />
  );
}

function ImageItem(props) {
  const { image, setMyBarbershop, showDeleteConfirm, myBarbershop } = props;

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (image) {
      getImageApi(image).then((response) => {
        
        setAvatar(response);

      });
    } else {
      setAvatar(null);
    }
  }, [myBarbershop]);


  return (
  <>
    < Card hoverable style={{ width: 240 }} cover={<img alt="Gallery" src={avatar} />}>
    </Card>
  </>
  );

}


