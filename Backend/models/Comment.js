const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    },
    postId: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
    },
    text: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "username photo",
  });
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
