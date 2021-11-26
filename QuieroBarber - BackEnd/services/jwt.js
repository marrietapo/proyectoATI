const jwt = require("jwt-simple");
const { unix } = require("moment");
const moment = require("moment");

SECRET_KEY = "sadjflkadjsflkjasdkfljasdf";

exports.getSecretKey = function(){
    return SECRET_KEY;
}


//función que genera el Access Token
exports.createAccessToken = function(user){
    const payload = {
        _id:user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role:user.role,
        avatar:user.avatar,
        active:user.active,
        barbershop:user.barbershop,
        favourites: user.favourites,
        createToken: moment().unix(),
        expiration: moment().add(15,"days").unix()
    }
    return jwt.encode(payload, SECRET_KEY);
};

//genera el Refresh Token
exports.createRefreshToken = function(user){
     const payload = {
       id: user._id,
       expiration: moment().add(30, "days").unix(),
     };

     return jwt.encode(payload, SECRET_KEY);
}

//función que decodifica los tokens
exports.decodedToken = function(token){
    return jwt.decode(token, SECRET_KEY, true);
};