const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrict,
    userController.createUser
  );

router
  .route("/signup")
  .post(userController.uploadUserPhoto, authController.signup);
router.route("/login").post(authController.login);
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);
router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);

router
  .route("/:id")
  .get(authController.protect, userController.getOneUser)
  .patch(
    authController.protect,
    authController.restrict,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrict,
    userController.deleteUser
  );

router
  .route("/:id/follow")
  .patch(authController.protect, userController.followUser);
router
  .route("/:id/unfollow")
  .patch(authController.protect, userController.unfollowUser);

module.exports = router;
