import React, { useState, useCallback, useEffect } from "react";
import {
  Avatar,
  Form,
  Button
} from "antd";
import { useDropzone } from "react-dropzone";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import { uploadImageApi } from "../../../../api/barbershop";
import { getAccessTokenApi } from "../../../../api/auth";

import "./AddImage.scss";

export default function AddImage(props) {
  const { setModalVisible, setMyBarbershop, myBarbershop, setReload } = props;
  console.log(myBarbershop);

  const [image, setImage] = useState({});

  useEffect(() => {
    if (image) {
      console.log(myBarbershop)
      if(!myBarbershop.images){
        setMyBarbershop({...myBarbershop, images :[]})
      }
      myBarbershop.images = [...myBarbershop.images, image.file]
      setMyBarbershop(myBarbershop);
      console.log(myBarbershop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  // useEffect(() => {
      
  // }, [myBarbershop])


  const addImage = (e) => {
    e.preventDefault();

    let barbershopEdited = myBarbershop;

    const token = getAccessTokenApi();

    if (typeof image === "object") {

     uploadImageApi(token,  image.file , barbershopEdited._id).then((response) => {
        if(response){
          setModalVisible(false);
          setReload(true);
        }
     });
    }
  };


  return (
    <div className="edit-user-form">
        <UploadAvatar image={image} setImage={setImage} />
        <Form className="form-edit" onSubmitCapture={addImage}>
        <Button type="primary" htmlType="submit" className="btn-submit">
          Agregar Imagen
        </Button>
    </Form>
      </div>
  );
}


function UploadAvatar(props) {
  const { image, setImage } = props;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (image) {
      if (image.preview) {
        setImageUrl(image.preview);
      } else {
        setImageUrl(image);
      }
    } else {
      setImageUrl(null);
    }
  }, [image]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage({ file, preview: URL.createObjectURL(file) });
    },
    [setImage]
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
        <Avatar size={150} src={imageUrl ? imageUrl : NoAvatar} />
      )}
    </div>
  );
}

