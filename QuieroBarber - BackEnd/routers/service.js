const express = require("express");
const ServiceController = require("../controllers/service");
const multipart = require("connect-multiparty");
const middleware_auth = require("../middleware/authenticated");
const middleware_upload_image = multipart({
  uploadDir: "./uploads/image-service",
});
const api = express.Router();

api.post(
  "/add-service/:id",
  [middleware_auth.ensureAuthWithAdminOrBarbershopPermission],
  ServiceController.addService
);
api.get(
  "/get-services",
  [middleware_auth.ensureAuthWithAdminOrBarbershopPermission],
  ServiceController.getServices
);
api.get(
  "/get-services-by-barbershop/:barbershop",
  [middleware_auth.ensureAuth],
  ServiceController.getServicesByBarbershop
);
api.get("/get-services-active", ServiceController.getServicesActive);
api.put(
  "/upload-image-service/:id",
  [
    middleware_auth.ensureAuthWithAdminOrBarbershopPermission,
    middleware_upload_image,
  ],
  ServiceController.uploadImage
);
api.get("/get-image-service/:imageName", ServiceController.getImage);
api.put(
  "/update-service/:id",
  [middleware_auth.ensureAuthWithAdminOrBarbershopPermission],
  ServiceController.updateService
);
api.put(
  "/activate-service/:id",
  [middleware_auth.ensureAuthWithAdminOrBarbershopPermission],
  ServiceController.activateService
);
api.delete(
  "/delete-service/:id",
  [middleware_auth.ensureAuthWithAdminOrBarbershopPermission],
  ServiceController.deleteService
);

module.exports = api;
