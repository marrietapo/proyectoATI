import React, { useState, useEffect } from "react";
import { getBarbershopByOwnerApi } from "../../../api/barbershop";
import { getAccessTokenApi } from "../../../api/auth";
import MyBarbershopForm from "../../../components/BarberAdmin/MyBarbershop";
import useBarbershop from "../../../hooks/useBarbershop";
import useAuth from "../../../hooks/useAuth";



import "./MyBarbershop.scss";

export default function MyBarbershop() {
  const {user} = useAuth();
  const barbershop  = useBarbershop();
  const [myBarbershop, setMyBarbershop] = useState(null)
  const token = getAccessTokenApi();

  useEffect(() => {
        if (barbershop!==null && myBarbershop===null) {
            getBarbershopByOwnerApi(token, user._id).then((response) => {
            setMyBarbershop(response.barbershop);
          });
        }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="barbershops">
      <MyBarbershopForm
        myBarbershop={myBarbershop}
        setMyBarbershop={setMyBarbershop}
      />
    </div>
    )
}

