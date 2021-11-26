const express = require("express");
const BarberShopController = require("../controllers/barbershop");
const middleware_auth = require("../middleware/authenticated");
const multipart = require("connect-multiparty");
const middleware_upload_logo = multipart({ uploadDir: "./uploads/logo-barbershop" });
const middleware_upload_image = multipart({ uploadDir: "./uploads/images-barbershop" });


const api = express.Router();

api.post(
  "/add-barbershop",
  [middleware_auth.ensureAuthWithAdminOrBarbershopPermission],
  BarberShopController.addBarberShop
);
api.post(
  "/add-barbershop-with-admin",
  [middleware_auth.ensureAuth],
  BarberShopController.addBarberShopAndAdmin
);
api.get(
  "/get-barbershops",
  BarberShopController.getBarberShops
);
api.get("/get-barbershops-active", BarberShopController.getBarbershopsActive);
api.get(
  "/get-barbershop/:id",
  BarberShopController.getBarberShop
);
api.get("/get-barbershop-by-owner/:owner", BarberShopController.getBarberShopByOwner);
api.put(
  "/update-barbershop/:id",
  [middleware_auth.ensureAuth],
  BarberShopController.updateBarberShop
);
api.put(
  "/activate-barbershop/:id",
  [middleware_auth.ensureAuth],
  BarberShopController.activateBarberShop
);
api.delete(
  "/delete-barbershop/:id",
  [middleware_auth.ensureAuth],
  BarberShopController.deleteBarberShop
);
api.put(
  "/upload-logo/:id",
  [middleware_auth.ensureAuth, middleware_upload_logo],
  BarberShopController.uploadLogo
);
api.get("/get-logo/:logoName", BarberShopController.getLogo);
api.put(
  "/upload-image/:id",
  [middleware_auth.ensureAuth, middleware_upload_image],
  BarberShopController.uploadImage
);
api.get("/get-image/:imageName", BarberShopController.getImage);

module.exports = api;
