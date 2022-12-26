const Conversation = require("../models/Conversation");
const catchAsync = require("../util/catchAsync");
const factory = require("../controllers/handlerFactory");

const AppError = require("../util/appError");
exports.createConversation = catchAsync(async (req, res, next) => {
  const existingConversation = await Conversation.find({
    members: { $all: [req.user._id, req.body.receiverId] },
  });

  if (existingConversation._id) {
    return next(new AppError("Conversation with these members already exist!"));
  }

  const data = await Conversation.create({
    members: [req.user._id, req.body.receiverId],
  });
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getUsersConversations = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const conversations = await Conversation.find({
    members: { $in: [id] },
  }).populate([{ path: "members", ref: "User" }, { path: "messages" }]);
  res.status(200).json({
    status: "success",
    data: conversations,
  });
});

exports.getOneConversation = factory.getOne(Conversation, "messages");

exports.getSpecificConv = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    members: { $all: [req.user._id, req.params.id] },
  }).populate([{ path: "messages" }, { path: "members", model: "User" }]);
  res.status(200).json({
    status: "success",
    data: conversation,
  });
});
exports.deleteConv = factory.deleteOne(Conversation);
