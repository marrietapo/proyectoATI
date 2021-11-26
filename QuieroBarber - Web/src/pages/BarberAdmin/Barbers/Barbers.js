import React, { useState, useEffect } from "react";
import {
  getBarbersActiveApi,
} from "../../../api/barber";
import { getAccessTokenApi } from "../../../api/auth";
import ListBarbers from "../../../components/BarberAdmin/Barbers/ListBarbers";
import useBarbershop from "../../../hooks/useBarbershop";

import "./Barbers.scss";

export default function Barber() {
  const barbershop = useBarbershop();
  const [inactiveBarbers, setInactiveBarbers] = useState([]);
  const [activeBarbers, setActiveBarbers] = useState([]);
  const [reloadBarbers, setReloadBarbers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAccessTokenApi();

  useEffect(() => {
    if(barbershop){
      getBarbersActiveApi(token, true, barbershop).then((response) => {
        setActiveBarbers(response.barbers);
      });
  
      getBarbersActiveApi(token, false, barbershop).then((response) => {
        setInactiveBarbers(response.barbers);
        setIsLoading(false);
      });
      setReloadBarbers(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reloadBarbers]);

  return (
    <div className="barbers">
      <ListBarbers
        activeBarbers={activeBarbers}
        inactiveBarbers={inactiveBarbers}
        setReloadBarbers={setReloadBarbers}
        isLoading={isLoading}
      />
    </div>
  );
}
