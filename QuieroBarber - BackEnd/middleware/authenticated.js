const jwt = require("jwt-simple");
const moment = require("moment");
const jwt_services = require("../services/jwt");

const SECRET_KEY = jwt_services.getSecretKey();

exports.ensureAuth = (req, res, next ) => {
    if(!req.headers.authorization){
        return res.status(403).send({message:"La petición no tiene cabecera de autenticación."});
    }

    const token = req.headers.authorization.replace(/['"]+/g,"");

    try{
        var payload = jwt.decode(token, SECRET_KEY);
        if(payload.expiration <= moment().unix()){
                    return res
                      .status(404)
                      .send({
                        message:
                          "El token ha expirado."
                      });
        }
    }catch(ex){
        return res
          .status(404)
          .send({ message: "Token inválido." });
    }
    req.user = payload;
    next();
}


exports.ensureAuthWithAdminPermission = (req, res, next) => {
  const { ADMIN_ROLE } = require("../config");
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ message: "La petición no tiene cabecera de autenticación." });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.expiration <= moment().unix()) {
      return res.status(404).send({
        message: "El token ha expirado.",
      });
    }
  } catch (ex) {
    return res.status(404).send({ message: "Token inválido." });
  }
  req.user = payload;
  if(req.user.role !== ADMIN_ROLE){
    return res.status(403).send({ message: "No posee los permisos necesarios para realizar la operación." });
  }
  next();
};

exports.ensureAuthWithAdminOrBarbershopPermission = (req, res, next) => {
  const { ADMIN_ROLE, BARBERSHOP_ROLE } = require("../config");
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ message: "La petición no tiene cabecera de autenticación." });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.expiration <= moment().unix()) {
      return res.status(404).send({
        message: "El token ha expirado.",
      });
    }
  } catch (ex) {
    return res.status(404).send({ message: "Token inválido." });
  }
  req.user = payload;
  if (req.user.role !== ADMIN_ROLE && req.user.role !== BARBERSHOP_ROLE ) {
    return res
      .status(403)
      .send({
        message: "No posee los permisos necesarios para realizar la operación.",
      });
  }
  next();
};



