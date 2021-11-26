const { default: axios } = require("axios");
const { FIREBASE_KEY } = require("../config");
const User = require("../models/user");
const fetch = require("node-fetch")




function sendNotifications(req, res) {
 
    const { title, message, tokens, image } = req.body;
    
    var notification = {
      title: title,
      body: message,
      image:image
    };
    getAllUsersTokens();
    var fcm_tokens = tokens;
    var notification_body = {
      notification: notification,
      registration_ids: fcm_tokens,
    };
    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: "key=" + FIREBASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification_body),
    })
      .then((result) => {
        if (!result) {
          res
            .status(404)
            .send({ message: "No se ha podido remitir la notificacion." });
        } else {
          res.status(200).send({
            message: "Notificación enviada correctamente.",
            result: result,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error en el servidor." });
      });
}

async function sendNotificationsAllUsers(req, res) {
  const { title, message } = req.body;

  var tokens = [];
  User.find()
    .select("notificationToken")
    .then((result) => {
      result.forEach((element) => {
        if (element.notificationToken) {
          tokens = [...tokens, element.notificationToken];
        }
      });
    })
    .then(() => {
      
       var notification = {
         title: title,
         body: message,
         image:
           "https://city.woow.com.uy/pub/media/catalog/product/cache/dcf64a24127a43d9ce9fe76e3e5f8061/b/a/barberia2.jpg",
       };
      
        var fcm_tokens = tokens;
        var notification_body = {
          notification: notification,
          registration_ids: fcm_tokens,
        };
            fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                Authorization: "key=" + FIREBASE_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(notification_body),
            })
        // axios({
        //   method: "POST",
        //   url: "https://fcm.googleapis.com/fcm/send",
        //   headers: {
        //     Authorization: "key=" + FIREBASE_KEY,
        //     "Content-Type": "application/json",
        //   },
        //   data: {
        //     message: title,
        //     title: message,
        //     image:
        //    "https://city.woow.com.uy/pub/media/catalog/product/cache/dcf64a24127a43d9ce9fe76e3e5f8061/b/a/barberia2.jpg"
        //   },
        // })
          .then((result) => {
            if (!result) {
              res
                .status(404)
                .send({ message: "No se ha podido remitir la notificacion." });
            } else {
              res.status(200).send({
                message: "Notificación enviada correctamente.",
                result: result,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({ message: "Error en el servidor." });
          });
    });

}

module.exports = {
  sendNotifications,
  sendNotificationsAllUsers,
};
