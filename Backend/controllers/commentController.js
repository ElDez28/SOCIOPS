const factory = require("../controllers/handlerFactory");
const Comment = require("../models/Comment");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");
exports.getAllComments = factory.getAll(Comment);
exports.getOneComment = factory.getOne(Comment);
exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError("No comment found", 404));
  }

  if (comment.userId[0]._id.toString() !== req.user._id.toString()) {
    return next(new AppError("You can delete only your own comments", 401));
  }
  await Comment.findByIdAndRemove(req.params.id);
  res.status(201).json({
    message: "Comment successfully deleted",
  });
});
exports.createComment = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id;
  req.body.postId = req.params.id;
  const comment = await Comment.create(req.body);
  res.status(200).json({
    message: "success",
    data: comment,
  });
});
