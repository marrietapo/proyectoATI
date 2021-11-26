import React, { useState, useEffect } from "react";
import { getBarbershopByOwnerApi } from "../../../api/barbershop";
import { getAccessTokenApi } from "../../../api/auth";
import useBarbershop from "../../../hooks/useBarbershop";
import useAuth from "../../../hooks/useAuth";



import "./CreateBarbershop.scss";
import CreateBarbershopForm from "../../../components/BarberAdmin/CreateBarbershop/CreateBarbershopForm";

export default function CreateBarbershop() {
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
      <CreateBarbershopForm/>
    </div>
    )
}

