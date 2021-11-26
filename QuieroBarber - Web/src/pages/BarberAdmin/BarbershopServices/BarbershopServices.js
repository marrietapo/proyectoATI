import React, { useState, useEffect } from "react";
import { getServicesActiveApi } from "../../../api/service";
import { getAccessTokenApi } from "../../../api/auth";
import ListServices from "../../../components/BarberAdmin/Services/ListServices";
import useBarbershop from "../../../hooks/useBarbershop";

import "./BarbershopServices.scss";

export default function BarbershopServices() {
  const barbershop = useBarbershop();
  const [inactiveServices, setInactiveServices] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [reloadServices, setReloadServices] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAccessTokenApi();

  useEffect(() => {

      if(barbershop){
      getServicesActiveApi(token, true, barbershop).then((response) => {
        setActiveServices(response.services);
      });
      
      getServicesActiveApi(token, false, barbershop).then((response) => {
        setInactiveServices(response.services);
        setIsLoading(false);
      });
    }
    setReloadServices(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reloadServices]);

  return (
    <div className="services">
      <ListServices
        activeServices={activeServices}
        inactiveServices={inactiveServices}
        setReloadServices={setReloadServices}
        isLoading ={isLoading}
      />
    </div>
  );
}
