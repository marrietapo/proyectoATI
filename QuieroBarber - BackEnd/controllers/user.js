const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");


function signUpOwner(req, res) {
  const { BARBERSHOP_ROLE } = require("../config");
  const user = new User();

  const { email, password, repeatPassword, name, lastName } = req.body;

  user.name = name;
  user.lastName = lastName;
  user.email = email.toLowerCase();
  user.active = true;
  user.role = BARBERSHOP_ROLE;

  if (!name || !lastName) {
    res.status(404).send({ message: "Nombre y Apellido obligatorios." });
  } else {
    if (!password || !repeatPassword) {
      res
        .status(400)
        .send({ message: "Las constraseñas son obligatorias." });
    } else {
      if (password != repeatPassword) {
        res
          .status(400)
          .send({ message: "Las constraseñas deben ser iguales." });
      } else {
        bcrypt.hash(password, null, null, function (error, hash) {
          if (error) {
            res
              .status(500)
              .send({
                message: "Error al encriptar la contraseña.",
              });
          } else {
            user.password = hash;
            user.save((error, result) => {
              if (error) {
                res.status(500).send({
                  message: "Correo electrónico inválido.",
                });
              } else {
                if (!result) {
                  res.status(404).send({
                    message: "Error al crear el usuario.",
                  });
                } else {
                  res.status(201).send({
                    message: "Usuario creado correctamente.",
                    user: result,
                  });
                }
              }
            });
          }
        });
      }
    }
  }
  user.password = password;
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(400).send({ message: "Credenciales incorrectas." });
      } else {
        bcrypt.compare(password, result.password, (err, valid) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor." });
          } else if (!valid) {
            res.status(400).send({ message: "Credenciales incorrectas." });
          } else {
            if (!result.active) {
              res
                .status(200)
                .send({ message: "El usuario no se ha activado." });
            } else {
              res.status(201).send({
                message: "Usuario logueado correctamente",
                accessToken: jwt.createAccessToken(result),
                refreshToken: jwt.createRefreshToken(result),
              });
            }
          }
        });
      }
    }
  });
}


function getUsers(req, res) {
  User.find().then((result) => {
    if (!result) {
      res.status(400).send({ message: "No se han encontrado usuarios." });
    } else {
      res.status(200).send({
        message: "Usuarios encontrados correctamente.",
        user: result,
      });
    }
  });
}


function getUser(req, res) {
  User.findById(req.user._id).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado usuario." });
    } else {
      res.status(200).send({
        message: "Usuario encontrado correctamente.",
        user: result,
      });
    }
  });
}




function signUpAdmin(req, res) {
  const { ADMIN_ROLE } = require("../config");
  const user = new User();

  const { email, password,repeatPassword, name, lastName } = req.body;

  user.name = name;
  user.lastName = lastName;
  user.email = email.toLowerCase();
  user.role = ADMIN_ROLE;
  user.active = false;

   if (!name || !lastName) {
     res.status(404).send({ message: "Nombre y Apellido obligatorios." });
   } else {
     if (!password || !repeatPassword) {
       res.status(400).send({ message: "Las constraseñas son obligatorias." });
     } else {
       if (password != repeatPassword) {
         res
           .status(400)
           .send({ message: "Las constraseñas deben ser iguales." });
       } else {
         bcrypt.hash(password, null, null, function (error, hash) {
           if (error) {
             res.status(500).send({
               message: "Error al encriptar la contraseña.",
             });
           } else {
             user.password = hash;
             user.save((error, result) => {
               if (error) {
                 res.status(500).send({
                   message: "Correo electrónico inválido.",
                 });
               } else {
                 if (!result) {
                   res.status(404).send({
                     message: "Error al crear el usuario.",
                   });
                 } else {
                   res.status(201).send({
                     message: "Usuario creado correctamente.",
                     user: result,
                   });
                 }
               }
             });
           }
         });
       }
     }
   }
   user.password = password;
}


function signUpClient(req, res) {
  const { CLIENT_ROLE } = require("../config");
  const user = new User();

  const { email, password, repeatPassword, name, lastName } = req.body;

  user.name = name;
  user.lastName = lastName;
  user.email = email.toLowerCase();
  user.role = CLIENT_ROLE;
  user.active = true;

   if (!name || !lastName) {
     res.status(404).send({ message: "Nombre y Apellido obligatorios." });
   } else {
     if (!password || !repeatPassword) {
       res.status(400).send({ message: "Las constraseñas son obligatorias." });
     } else {
       if (password != repeatPassword) {
         res
           .status(400)
           .send({ message: "Las constraseñas deben ser iguales." });
       } else {
         bcrypt.hash(password, null, null, function (error, hash) {
           if (error) {
             res.status(500).send({
               message: "Error al encriptar la contraseña.",
             });
           } else {
             user.password = hash;
             user.save((error, result) => {
               if (error) {
                 res.status(500).send({
                   message: "Correo electrónico inválido.",
                 });
               } else {
                 if (!result) {
                   res.status(404).send({
                     message: "Error al crear el usuario.",
                   });
                 } else {
                   res.status(201).send({
                     message: "Usuario creado correctamente.",
                     user: result,
                   });
                 }
               }
             });
           }
         });
       }
     }
   }
   user.password = password;
}


function getUsersActive(req, res) {
  const query = req.query;
  User.find({ active: query.active }).then((result) => {
    if (!result) {
      res.status(400).send({ message: "No se han encontrado usuarios." });
    } else {
      res.status(200).send({
        message: "Usuarios encontrados correctamente.",
        users: result,
      });
    }
  });
}


function uploadAvatar(req, res) {
  
  const params = req.params;
  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor." });
    } else {
      if (!userData) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        let user = userData;
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
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error en el servidor." });
                } else {
                  if (!userResult) {
                    res.status(404).send({ message: "Usuario no encontrado." });
                  } else {
                    res.status(200).send({
                      message: "Avatar modificado correctamente.",
                      usuario: userResult,
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


function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar-user/" + avatarName;
  fs.access(filePath, (error) => {
    if (!error) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({ message: "El avatar buscado no existe." });
    }
  });
}



async function updateUser(req, res) {
  let data = req.body;
  if(req.body.email){
    data.email = req.body.email.toLowerCase();
  }
  const params = req.params;

  if (data.password) {
    await bcrypt.hash(data.password, null, null, (error, hash) => {
      if (error) {
        res.status(500).send({ message: "Error al encriptar contraseña." });
      } else {
        data.password = hash;
      }
    });
  }

  User.findByIdAndUpdate({ _id: params.id }, data, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res.status(200).send({ message: "Usuario actualizado correctamente." });
      }
    }
  });
}

function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  User.findByIdAndUpdate(id, { active }, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Usuario activado correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Usuario desactivado correctamente." });
        }
      }
    }
  });
}

function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndRemove(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res.status(200).send({ message: "Usuario eliminado correctamente." });
      }
    }
  });
}


module.exports = {
  signUp: signUpOwner,
  signIn,
  getUsers,
  getUser,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  signUpAdmin,
  signUpClient,
};
