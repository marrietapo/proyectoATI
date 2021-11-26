const express = require("express");
const NotificationController = require("../controllers/notifications");
const middleware_auth = require("../middleware/authenticated");
const api = express.Router();


api.post(
  "/send-notifications",
  [middleware_auth.ensureAuth],
  NotificationController.sendNotifications
);

api.post(
  "/send-notifications-all-users",
  [middleware_auth.ensureAuth],
  NotificationController.sendNotificationsAllUsers
);



module.exports = api;
