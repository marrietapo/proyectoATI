import React, { useState, useEffect } from "react";
import { getReservationsByBarbershopApi } from "../../../api/reservation";
import { getAccessTokenApi } from "../../../api/auth";
import ListReservations from "../../../components/BarberAdmin/Reservations/ListReservations";
import useBarbershop from "../../../hooks/useBarbershop";

import "./Reservations.scss";

export default function Reservations() {
  const barbershop = useBarbershop();
  const [reservations, setReservations] = useState([]);
  const [reloadReservations, setReloadReservations] = useState(false);
  const token = getAccessTokenApi();

  useEffect(() => {
    if (barbershop) {
      getReservationsByBarbershopApi(token, barbershop).then((response) => {
        setReservations(response.reservations);
      });
    }

    setReloadReservations(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, reloadReservations]);

  return (
    <div className="barbers">
      <ListReservations reservations={reservations} setReloadReservations={setReloadReservations} />
    </div>
  );
}
