const express = require("express");
const BarberController = require("../controllers/barber");
const multipart = require("connect-multiparty");
const middleware_auth = require("../middleware/authenticated");
const middleware_upload_avatar = multipart({ uploadDir: "./uploads/avatar-barber" });
const api = express.Router();

api.post(
  "/add-barber/:id",
  [middleware_auth.ensureAuth],
  BarberController.addBarber
);
api.get(
  "/get-barbers",
  [middleware_auth.ensureAuth],
  BarberController.getBarbers
);
api.get(
  "/get-barber/:id",
  [middleware_auth.ensureAuth],
  BarberController.getBarber
);
api.get(
  "/get-barbers-active",
  [middleware_auth.ensureAuth],
  BarberController.getBarbersActive
);
api.put(
  "/upload-avatar-barber/:id",
  [middleware_auth.ensureAuth, middleware_upload_avatar],
  BarberController.uploadAvatar
);
api.get("/get-avatar-barber/:avatarName", BarberController.getAvatar);
api.put(
  "/update-barber/:id",
  [middleware_auth.ensureAuth],
  BarberController.updateBarber
);
api.get(
  "/get-barbers-by-barbershop/:barbershop",
  [middleware_auth.ensureAuth],
  BarberController.getBarbersByBarbershop
);
api.put(
  "/activate-barber/:id",
  [middleware_auth.ensureAuth],
  BarberController.activateBarber
);
api.delete(
  "/delete-barber/:id",
  [middleware_auth.ensureAuth],
  BarberController.deleteBarber
);


module.exports = api;
