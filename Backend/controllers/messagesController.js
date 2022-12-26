const Message = require("../models/Message");
const catchAsync = require("../util/catchAsync");

exports.createMessage = catchAsync(async (req, res, next) => {
  req.body.sender = req.user._id;
  const message = await Message.create(req.body);
  res.status(200).json({
    status: "success",
    data: message,
  });
});
