const factory = require("./handlerFactory");
const Post = require("../models/postModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const multer = require("multer");
const Comment = require("../models/Comment");
const APIFeatures = require("../controllers/apiFeatures");
const { v1: uuid } = require("uuid");
// exports.getAllPosts = factory.getAll(Post, ["userId"]);
exports.deletePost = factory.deleteOne(Post);
exports.getOnePost = factory.getOne(Post);

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const query = Post.find().populate("userId");
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;
  const comments = await Comment.find();
  res.status(200).json({
    message: "success",
    data: posts,
    comments,
  });
});

exports.updateMyPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("Post not found", 404));

  if (post.userId !== req.user._id.toString()) {
    return next(new AppError("You can not update other peoples posts", 401));
  }
  await post.updateOne({ $set: { desc: req.body.desc } });
  res.status(200).json({
    status: "success",
    message: "Update is successfull",
  });
});
exports.deleteMyPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("Post not found", 404));

  if (post.userId !== req.user._id.toString()) {
    return next(new AppError("You can not delete other peoples posts", 401));
  }
  await post.deleteOne();
  res.status(200).json({
    status: "success",
    message: "Post successfully deleted",
  });
});
exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("This post does not longer exist", 404));
  if (post.likes.includes(req.user._id)) {
    await post.updateOne({ $pull: { likes: req.user._id } });
  } else {
    if (post.hearths.includes(req.user._id)) {
      await post.updateOne({ $pull: { hearths: req.user._id } });
    }
    await post.updateOne({ $push: { likes: req.user._id } });
  }
  res.status(200).json({
    status: "success",
    message: "like/dislike is successfull",
  });
});
exports.lovePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("This post does not longer exist", 404));
  if (post.hearths.includes(req.user._id)) {
    await post.updateOne({ $pull: { hearths: req.user._id } });
  } else {
    if (post.likes.includes(req.user._id)) {
      await post.updateOne({ $pull: { likes: req.user._id } });
    }
    await post.updateOne({ $push: { hearths: req.user._id } });
  }
  res.status(200).json({
    status: "success",
    message: "like/dislike is successfull",
  });
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ userId: req.params.id }).populate("comments");

  res.status(200).json({
    status: "success",
    data: posts,
  });
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `post-${uuid()}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image. Please upload only images", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostPhoto = upload.single("img");

exports.createPost = catchAsync(async (req, res, next) => {
  const bodyObj = {
    userId: req.user._id,
    desc: req.body.desc,
  };
  if (req.file) {
    bodyObj.img = req.file.filename;
  }
  const newPost = await Post.create(bodyObj);
  const populatedPost = await newPost.populate({
    path: "userId",
    model: "User",
  });
  res.status(200).json({
    status: "success",
    data: populatedPost,
  });
});
