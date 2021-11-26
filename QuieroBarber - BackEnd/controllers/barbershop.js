const BarberShop = require("../models/barbershop");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const { BARBERSHOP_ROLE } = require("../config");
const barbershop = require("../models/barbershop");
const bcrypt = require("bcrypt-nodejs");


function addBarberShop(req, res) {
  const {
    name,
    description,
    address,
    images,
    geo,
    logo,
    phone,
    social,
    owner = [req.user._id],
  } = req.body;

  const barberShop = new BarberShop();
  barberShop.name = name;
  barberShop.description = description;
  barberShop.address = address;
  barberShop.images = images;
  barberShop.logo = logo;
  barberShop.comments = [];
  barberShop.geo = geo;
  barberShop.phone = phone;
  barberShop.barbers = [];
  barberShop.active = true;
  barberShop.coffee = false;
  barberShop.child = false;
  barberShop.owner = owner;
  barberShop.social= social;

  const user = new User();
  user._id = req.user._id;
  barberShop.save((error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Error al crear la Barbería." });
      } else {
        res.status(201).send({
          message: "Barbería creada correctamente.",
          barbershop: result,
        });
      }
    }
  });
}



function addBarberShopAndAdmin(req, res) {
  const {
    name,
    description,
    address,
    geo,
    logo,
    phone,
    userName,
    userLastName,
    userEmail, 
    userPassword,
    userRepeatPassword
  } = req.body;

  const barberShop = new BarberShop();
  barberShop.name = name;
  barberShop.description = description;
  barberShop.address = address;
  barberShop.images = [];
  barberShop.logo = logo;
  barberShop.comments = [];
  barberShop.geo = geo;
  barberShop.phone = phone;
  barberShop.barbers = [];
  barberShop.active = true;
  console.log(barberShop);

  const user = new User();
  user.name = userName;
  user.lastName = userLastName; 
  user.email = userEmail;
  user.role = BARBERSHOP_ROLE;
  user.active = true;
  user.avatar =""


if (!userName || !userLastName || !name || !description || !phone || !address) {
    res.status(404).send({ message: "Nombre y Apellido obligatorios." });
  } else {
    if (!userPassword || !userRepeatPassword) {
      res
        .status(400)
        .send({ message: "Las constraseñas son obligatorias." });
    } else {
      if (userPassword != userRepeatPassword) {
        res
          .status(400)
          .send({ message: "Las constraseñas deben ser iguales." });
      } else {
        bcrypt.hash(userPassword, null, null, function (error, hash) {
          if (error) {
            res
              .status(500)
              .send({
                message: "Error al encriptar la contraseña.",
              });
          } else {
            console.log("llega hasta acá")
            try {
              user.password = hash;
              user.save((error, result) => {
                if (error) {
                  res.status(500).send({
                    message: "Correo electrónico inválido.",
                  });
                } else {
                  console.log(result)
                  if (!result) {
                    res.status(404).send({
                      message: "Error al crear el usuario.",
                    });
                  } else {
                    barberShop.owner = result._id;
                    barberShop.save((error, resp) => {
                    if (error) {
                      res.status(500).send({ message: "Error del servidor." });
                    } else {
                      if (!resp) {
                        res.status(404).send({ message: "Error al crear la Barbería." });
                      } else {
                        res.status(201).send({
                          message: "Barbería y administrador creados correctamente.",
                          barbershop: resp
                        });
                      }
                    }
                  });
                  }
                }
              });
            } catch (error) {
              console.log(error)
              
            }
          }
        });
      }
    }
  }
}




function getBarberShops(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: page,
    limit: parseInt(limit),
    sort: { name: "desc" },
  };
  BarberShop.paginate({}, options, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "No se han encontrado Barberías." });
      } else {
        res.status(200).send({
          message: "Barberías encontradas correctamente.",
          barbershops: result,
        });
      }
    }
  });
}

function getBarbershopsActive(req, res) {
  const query = req.query;
  BarberShop.find({ active: query.active }).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado barberías." });
    } else {
      res.status(200).send({
        message: "Barberías encontradas correctamente.",
        barbershops: result,
      });
    }
  });
}

function updateBarberShop(req, res) {
  let barberShopData = req.body;
  const params = req.params;
  BarberShop.findByIdAndUpdate(params.id, barberShopData, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "No se ha encontrado la Barbería." });
      } else {
        res.status(200).send({
          message: "Barbería actualizada correctamente.",
        });
      }
    }
  });
}

function getBarberShop(req, res) {
  const params = req.params;
  BarberShop.findById(params.id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "No se ha encontrado la Barbería." });
      } else {
        res.status(200).send({
          message: "Barbería encontrada correctamente.",
          barbershop: result,
        });
      }
    }
  });
}

function getBarberShopByOwner(req, res) {
  let owner = req.params.owner;
  BarberShop.findOne({ owner }).then((result, error) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "No se ha encontrado la Barbería." });
      } else {
        res.status(200).send({
          message: "Barbería encontrada correctamente.",
          barbershop: result,
        });
      }
    }
  });
}

function activateBarberShop(req, res) {
  const { id } = req.params;
  const { active } = req.body;
  BarberShop.findByIdAndUpdate(id, { active }, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "No se ha encontrado la Barbería." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Barbería activada correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Barbería desactivada correctamente." });
        }
      }
    }
  });
}

function deleteBarberShop(req, res) {
  const { id } = req.params;

  BarberShop.findByIdAndRemove(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Barbería no encontrada." });
      } else {
        res.status(200).send({ message: "Barbería eliminada correctamente." });
      }
    }
  });
}

function uploadLogo(req, res) {
  const params = req.params;
  BarberShop.findById({ _id: params.id }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Barbería no encontrada." });
      } else {
        let barberShop = result;
        if (req.files) {
          let filePath = req.files.logo.path;
          let fileSplit = filePath.split("/");  //linux
          //let fileSplit = filePath.split("\\"); //windows
          let fileName = fileSplit[2];
          let extensionSplit = fileName.split(".");
          let fileExtension = extensionSplit[1];
          if (fileExtension !== "png" && fileExtension !== "jpg") {
            res.status(400).send({
              message:
                "La extensión de imagen no es válida (Admitidas: .png .jpg)",
            });
          } else {
            barberShop.logo = fileName;
            BarberShop.findByIdAndUpdate(
              { _id: params.id },
              barberShop,
              (err, result) => {
                if (err) {
                  res.status(500).send({ message: "Error en el servidor." });
                } else {
                  if (!result) {
                    res
                      .status(404)
                      .send({ message: "Barbería no encontrada." });
                  } else {
                    res.status(200).send({
                      message: "Logo modificado correctamente.",
                      barbershop: result,
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

function getLogo(req, res) {
  const logoName = req.params.logoName;
  const filePath = "./uploads/logo-barbershop/" + logoName;
  fs.access(filePath, (error) => {
    if (!error) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({ message: "El logo buscado no existe." });
    }
  });
}

function uploadImage(req, res) {
  const params = req.params;
  BarberShop.findById({ _id: params.id }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Barbería no encontrada." });
      } else {
        let barberShop = result;
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
            barberShop.images = [...barberShop.images, fileName];
            BarberShop.findByIdAndUpdate(
              { _id: params.id },
              barberShop,
              (err, result) => {
                if (err) {
                  res.status(500).send({ message: "Error en el servidor." });
                } else {
                  if (!result) {
                    res
                      .status(404)
                      .send({ message: "Barbería no encontrada." });
                  } else {
                    res.status(200).send({
                      message: "Imagen agregada correctamente.",
                      barbershop: result,
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
  const filePath = "./uploads/images-barbershop/" + imageName;
  fs.access(filePath, (error) => {
    if (!error) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({ message: "La imagen buscada no existe." });
    }
  });
}

module.exports = {
  addBarberShop,
  getBarberShops,
  getBarberShop,
  getBarberShopByOwner,
  getBarbershopsActive,
  updateBarberShop,
  activateBarberShop,
  deleteBarberShop,
  uploadLogo,
  addBarberShopAndAdmin,
  getLogo,
  uploadImage,
  getImage,
};
