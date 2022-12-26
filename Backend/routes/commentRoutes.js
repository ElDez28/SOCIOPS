const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");
router.route("/").get(commentController.getAllComments);
router
  .route("/:id")
  .delete(authController.protect, commentController.deleteComment)
  .post(authController.protect, commentController.createComment)
  .get(commentController.getOneComment);

module.exports = router;
