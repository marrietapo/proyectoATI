const express = require("express");
const ReservationController = require("../controllers/reservation");
const middleware_auth = require("../middleware/authenticated");
const api = express.Router();

api.post(
  "/add-reservation",
  [middleware_auth.ensureAuth],
  ReservationController.addReservation
);
api.get(
  "/get-reservations",
  [middleware_auth.ensureAuth],
  ReservationController.getReservations
);
api.get(
  "/get-reservation/:id",
  [middleware_auth.ensureAuth],
  ReservationController.getReservation
);
api.get(
  "/get-next-reservation/:user",
  [middleware_auth.ensureAuth],
  ReservationController.getNextReservation
);
api.get(
  "/get-reservations-by-date-and-barber",
  [middleware_auth.ensureAuth],
  ReservationController.getReservationsByBarberAndDate
);
api.get(
  "/get-reservations-by-barbershop/:barbershop",
  [middleware_auth.ensureAuth],
  ReservationController.getReservationsByBarbershop
);
api.get(
  "/get-reservations-by-user/:user",
  [middleware_auth.ensureAuth],
  ReservationController.getReservationsByUser
);
api.get(
  "/get-reservations-by-barber/:barber",
  [middleware_auth.ensureAuth],
  ReservationController.getReservationsByBarber
);
api.get(
  "/get-reservations-active/:barbershop",
  ReservationController.getReservationsActive
);
api.put(
  "/update-reservation/:id",
  [middleware_auth.ensureAuth],
  ReservationController.updateReservation
);
api.put(
  "/activate-reservation/:id",
  [middleware_auth.ensureAuth],
  ReservationController.activateReservation
);
api.delete(
  "/delete-reservation/:id",
  [middleware_auth.ensureAuth],
  ReservationController.deleteReservation
);

module.exports = api;
