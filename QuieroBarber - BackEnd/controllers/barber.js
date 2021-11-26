const Barber = require("../models/barber");
const BarberShop = require("../models/barbershop");
const fs = require("fs");
const path = require("path");

function addBarber(req, res) {
  const { name, lastName, description, aka, active=true, until, avatar, from } = req.body;
    
  const params = req.params;
  
  const barber = new Barber();
  barber.name = name;
  barber.lastName = lastName;
  barber.description = description;
  barber.aka = aka;
  barber.active = active;
  barber.avatar = avatar;
  barber.from = from;
  barber.until = until;
  barber.barbershop = params.id;

  barber.save((error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Error al crear el barbero." });
      } else {
        let barber = result;
        BarberShop.findById(params.id, (error, result) => {
          if (error) {
            res.status(500).send({ message: "Error del servidor." });
          } else {
            if (!result) {
              res
                .status(404)
                .send({ message: "No se ha encontrado la Barbería." });
            } else {
              let barberShop = new BarberShop();
              barberShop=result;

              barberShop.barbers = [...barberShop.barbers, barber._id];
              BarberShop.findByIdAndUpdate(
                params.id,
                barberShop,
                (error, result) => {
                  if (error) {
                    res.status(500).send({ message: "Error del servidor." });
                  } else {
                    if (!result) {
                      res
                        .status(404)
                        .send({ message: "No se ha encontrado la Barbería." });
                    } else {
                      res.status(200).send({
                        message: "Barbero agregado correctamente.",
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

function getBarbers(req, res) {
  Barber.find().then((barbers) => {
    if (!barbers) {
      res.status(404).send({ message: "No se han encontrado barberos." });
    } else {
      res.status(200).send({
        message: "Barberos encontrados correctamente.",
        barbers: barbers,
      });
    }
  });
}

function getBarbersByBarbershop(req, res) {
  let barbershop = req.params.barbershop;
  Barber.find({ barbershop }).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado barberos." });
    } else {
      res.status(200).send({
        message: "Barberos encontrados correctamente.",
        barbers: result,
      });
    }
  });
}

function getBarbersActive(req, res) {
  const { active, barbershop } = req.query;
  Barber.find({ active, barbershop}).then(
    (barbers) => {
      if (!barbers) {
        res.status(404).send({ message: "No se han encontrado barberos." });
      } else {
        res.status(200).send({
          message: "Barberos encontrados correctamente.",
          barbers: barbers,
        });
      }
    }
  );
}




function uploadAvatar(req, res) {
  const params = req.params;
  Barber.findById({ _id: params.id }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        let barber = result;
        if (req.files) {
          let filePath = req.files.avatar.path;
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
            barber.avatar = fileName;
            Barber.findByIdAndUpdate(
              { _id: params.id },
              barber,
              (err, result) => {
                if (err) {
                  res.status(500).send({ message: "Error en el servidor." });
                } else {
                  if (!result) {
                    res.status(404).send({ message: "Barbero no encontrado." });
                  } else {
                    res.status(200).send({
                      message: "Avatar modificado correctamente.",
                      usuario: result,
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

function getBarber(req, res) {
  const params = req.params;
  Barber.findById(params.id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "No se ha encontrado el Barbero." });
      } else {
        res.status(200).send({
          message: "Barbero encontrada correctamente.",
          barber: result,
        });
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar-barber/" + avatarName;
  fs.access(filePath, (error) => {
    if (!error) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({ message: "El avatar buscado no existe." });
    }
  });
}

async function updateBarber(req, res) {
  let barberData = req.body;
  const params = req.params;
  Barber.findByIdAndUpdate({ _id: params.id }, barberData, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Barbero no encontrado." });
      } else {
        res.status(200).send({ message: "Barbero actualizado correctamente." });
      }
    }
  });
}

function activateBarber(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  Barber.findByIdAndUpdate(id, { active }, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Barbero activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Barbero desactivado correctamente." });
        }
      }
    }
  });
}

function deleteBarber(req, res) {
  const { id } = req.params;

  Barber.findByIdAndRemove(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Barbero no encontrado." });
      } else {
        res.status(200).send({ message: "Barbero eliminado correctamente." });
      }
    }
  });
}

module.exports = {
  addBarber,
  getBarbers,
  getBarbersActive,
  uploadAvatar,
  getAvatar,
  updateBarber,
  activateBarber,
  deleteBarber,
  getBarbersByBarbershop,
  getBarber,
};
