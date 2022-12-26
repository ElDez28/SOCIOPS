const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const messagesController = require("../controllers/messagesController");

router
  .route("/")
  .post(authController.protect, messagesController.createMessage);

module.exports = router;
