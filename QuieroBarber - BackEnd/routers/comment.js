const express = require("express");
const CommentController = require("../controllers/comment");
const middleware_auth = require("../middleware/authenticated");
const api = express.Router();

api.post(
  "/add-comment",
  [middleware_auth.ensureAuth],
  CommentController.addComment
);
api.get(
  "/get-comments",
  [middleware_auth.ensureAuth],
  CommentController.getComments
);
api.get(
  "/get-comments-by-barbershop/:barbershop",
  [middleware_auth.ensureAuth],
  CommentController.getCommentsByBarbershop
);
api.delete(
  "/delete-comment/:id",
  [middleware_auth.ensureAuth],
  CommentController.deleteComment
);

module.exports = api;
