import React, { useState, useEffect } from "react";
import { getBarbershopsActiveApi } from "../../../api/barbershop";
import { getAccessTokenApi } from "../../../api/auth";
import ListBarbershops from "../../../components/Admin/Barbershops/ListBarbershops";

import "./Barbershops.scss";

export default function Barbershops() {
  const [inactiveBarbershops, setInactiveBarbershops] = useState([]);
  const [activeBarbershops, setActiveBarbershops] = useState([]);
  const [reloadBarbershops, setReloadBarbershops] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAccessTokenApi();

  useEffect(() => {
    getBarbershopsActiveApi(token, true).then((response) => {
      setActiveBarbershops(response.barbershops);
    });
    getBarbershopsActiveApi(token, false).then((response) => {
      setInactiveBarbershops(response.barbershops);
      setIsLoading(false);
    });
    setReloadBarbershops(false);
  }, [token, reloadBarbershops]);

  return (
    <div className="barbershops">
      <ListBarbershops
        activeBarbershops={activeBarbershops}
        inactiveBarbershops={inactiveBarbershops}
        setReloadBarbershops={setReloadBarbershops}
        isLoading={isLoading}
      />
    </div>
  );
}
