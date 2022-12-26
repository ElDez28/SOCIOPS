const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    postController.uploadPostPhoto,
    postController.createPost
  );

router
  .route("/:id/likePost")
  .patch(authController.protect, postController.likePost);
router
  .route("/:id/lovePost")
  .patch(authController.protect, postController.lovePost);

router
  .route("/:id/deleteMyPost")
  .delete(authController.protect, postController.deleteMyPost);
router.route("/:id/getUserPosts").get(postController.getUserPosts);

router
  .route("/:id")
  .get(postController.getOnePost)
  .patch(authController.protect, postController.updateMyPost)
  .delete(
    authController.protect,
    authController.restrict,
    postController.deletePost
  );
module.exports = router;
