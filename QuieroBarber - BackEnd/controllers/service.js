const Service = require("../models/service");
const BarberShop = require("../models/barbershop");
const fs = require("fs");
const path = require("path");

function addService(req, res) {
  const { name, description, price, duration } = req.body;

  const service = new Service();
  service.name = name;
  service.description = description;
  service.price = price;
  service.duration = duration;
  service.active = true;
  service.barbershop = req.params.id;

  let barb = req.params.id;

  service.save((error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Error al crear el servicio." });
      } else {
        let createdService = result;
        BarberShop.findById(barb, (error, result) => {
          if (error) {
            res.status(500).send({ message: "Error del servidor es aca." });
          } else {
            if (!result) {
              res
                .status(404)
                .send({ message: "No se ha encontrado la Barbería." });
            } else {
              let barberShop = new BarberShop();
              barberShop = result;

              barberShop.services = [
                ...barberShop.services,
                createdService._id,
              ];
              BarberShop.findByIdAndUpdate(
                barb,
                barberShop,
                (error, result) => {
                  if (error) {
                    res
                      .status(500)
                      .send({ message: "Error del servidor es este." });
                  } else {
                    if (!result) {
                      res
                        .status(404)
                        .send({ message: "No se ha encontrado la Barbería." });
                    } else {
                      res.status(200).send({
                        message: "Servicio agregado correctamente.",
                      });
                    }
                  }
                }
              );
            }
          }
        });
      }
    }
  });
}

function getServices(req, res) {
  Service.find().then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado servicios." });
    } else {
      res.status(200).send({
        message: "Servicios encontrados correctamente.",
        services: result,
      });
    }
  });
}

function getServicesByBarbershop(req, res) {
  let barbershop = req.params.barbershop;
  Service.find({ barbershop }).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado servicios." });
    } else {
      res.status(200).send({
        message: "Servicios encontrados correctamente.",
        services: result,
      });
    }
  });
}

function uploadImage(req, res) {
  const params = req.params;
  Service.findById({ _id: params.id }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Servicio no encontrado." });
      } else {
        let service = result;
        if (req.files) {
          let filePath = req.files.image.path;
          let fileSplit = filePath.split("/");
          let fileName = fileSplit[2];
          let extensionSplit = fileName.split(".");
          let fileExtension = extensionSplit[1];
          if (fileExtension !== "png" && fileExtension !== "jpg") {
            res.status(400).send({
              message:
                "La extensión de imagen no es válida (Admitidas: .png .jpg)",
            });
          } else {
            service.image = fileName;
            Service.findByIdAndUpdate(
              { _id: params.id },
              service,
              (err, serviceResult) => {
                if (err) {
                  res.status(500).send({ message: "Error en el servidor." });
                } else {
                  if (!serviceResult) {
                    res
                      .status(404)
                      .send({ message: "Servicio no encontrado." });
                  } else {
                    res.status(200).send({
                      message: "Imagen agregada correctamente.",
                      service: serviceResult,
                    });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getImage(req, res) {
  const imageName = req.params.imageName;
  const filePath = "./uploads/image-service/" + imageName;
  fs.access(filePath, (error) => {
    if (!error) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({ message: "La imagen buscada no existe." });
    }
  });
}

async function updateService(req, res) {
  let data = req.body;

  const params = req.params;

  Service.findByIdAndUpdate({ _id: params.id }, data, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Servicio no encontrado." });
      } else {
        res
          .status(200)
          .send({ message: "Servicio actualizado correctamente." });
      }
    }
  });
}

function activateService(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  Service.findByIdAndUpdate(id, { active }, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Servicio no encontrado." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Servicio activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Servicio desactivado correctamente." });
        }
      }
    }
  });
}

function getServicesActive(req, res) {
  
  const { active, barbershop } = req.query;
  Service.find({ active, barbershop }).then(
    (services) => {
      if (!services) {
        res.status(404).send({ message: "No se han encontrado servicios." });
      } else {
        res.status(200).send({
          message: "Servicios encontrados correctamente.",
          services: services,
          ver: req.params.active
        });
      }
    }
  );
}

function deleteService(req, res) {
  const { id } = req.params;
  Service.findByIdAndRemove(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Servicio no encontrado." });
      } else {
        res.status(200).send({ message: "Servicio eliminado correctamente." });
      }
    }
  });
}

module.exports = {
  addService,
  getServices,
  uploadImage,
  getImage,
  updateService,
  activateService,
  getServicesByBarbershop,
  deleteService,
  getServicesActive,
};
