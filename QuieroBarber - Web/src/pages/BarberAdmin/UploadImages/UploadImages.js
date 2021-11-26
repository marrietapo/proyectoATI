import React, { useState, useEffect } from "react";
import ListImages from '../../../components/BarberAdmin/UploadImagesForm/ListImages';
import ImagesForm from "../../../components/BarberAdmin/UploadImagesForm/ImagesForm";

import { getBarbershopByOwnerApi } from "../../../api/barbershop";
import { getAccessTokenApi } from "../../../api/auth";
import useBarbershop from "../../../hooks/useBarbershop";
import useAuth from "../../../hooks/useAuth";


import "./UploadImages.scss"

export default function UploadImages() {
    
     const { user } = useAuth();
     const barbershop = useBarbershop();
     const [myBarbershop, setMyBarbershop] = useState(null);
     const [reload, setReload] = useState(false)
     const token = getAccessTokenApi();
     const [loading, setLoading] = useState(true);

     if (barbershop !== null && myBarbershop === null) {
       getBarbershopByOwnerApi(token, user._id).then((response) => {
         setMyBarbershop(response.barbershop);
       }).then(
       );
     }
    
     useEffect(() => {
      if (barbershop !== null && myBarbershop === null) {
        getBarbershopByOwnerApi(token, user._id)
          .then((response) => {
            setMyBarbershop(response.barbershop);
            setLoading(false);

          })
          .then();
      }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [reload]);
    
    if(loading){
      return(<></>)
    }else{
    return (
      <ImagesForm
        myBarbershop={myBarbershop}
        setMyBarbershop={setMyBarbershop}
        setReload={setReload}
      />
    );

    }
    
    
}
