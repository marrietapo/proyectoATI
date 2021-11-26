const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");
const middleware_auth = require("../middleware/authenticated");
const middleware_upload_avatar = multipart({ uploadDir: "./uploads/avatar-user" });
const api = express.Router();

api.post("/sign-up-owner", UserController.signUp);
api.post("/sign-up-admin",UserController.signUpAdmin);
api.post("/sign-up-client", UserController.signUpClient);
api.post("/sign-in", UserController.signIn);
api.get("/users", [middleware_auth.ensureAuth], UserController.getUsers);
api.get("/get-user", [middleware_auth.ensureAuth], UserController.getUser);
api.get("/users-active", [middleware_auth.ensureAuth], UserController.getUsersActive);
api.put("/upload-avatar/:id",[middleware_auth.ensureAuth, middleware_upload_avatar], UserController.uploadAvatar);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/update-user/:id",[middleware_auth.ensureAuth],UserController.updateUser);
api.put("/activate-user/:id",[middleware_auth.ensureAuth],UserController.activateUser);
api.delete("/delete-user/:id",[middleware_auth.ensureAuth],UserController.deleteUser);

module.exports = api;
