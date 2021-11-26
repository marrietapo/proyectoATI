import React, { useState, useEffect } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import {
  uploadImageApi,
  updateBarbershopApi,
} from "../../../../api/barbershop";
import { getAccessTokenApi } from "../../../../api/auth";

export default function ImagesForm(props) {

    const { myBarbershop, setMyBarbershop} = props;

    
//   const [fileList, setFileList] = useState([
//     {
//       uid: "-1",
//       name: "image.png",
//       status: "done",
//       url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
//     },
//   ]);


    const [fileList, setFileList] = useState([])


  const onChange = async ({ fileList: newFileList }) => {
    await setFileList(newFileList);

    const token = getAccessTokenApi();


    //  uploadImageApi(token, newFileList[0].file,  myBarbershop._id).then((response) => {
    //    myBarbershop.images = [...myBarbershop.images, response.imageName];
    //  });

  }

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate>
      <Upload
        //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 10 && "+ Upload"}
      </Upload>
    </ImgCrop>
  );
}
