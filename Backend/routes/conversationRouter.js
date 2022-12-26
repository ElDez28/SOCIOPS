const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationsController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(authController.protect, conversationController.createConversation);
router
  .route("/myConversations")
  .get(authController.protect, conversationController.getUsersConversations);
router
  .route("/:id")
  .get(authController.protect, conversationController.getOneConversation)
  .delete(authController.protect, conversationController.deleteConv);
router
  .route("/specificMembers/:id")
  .get(authController.protect, conversationController.getSpecificConv);

module.exports = router;
