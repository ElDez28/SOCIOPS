const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    hearths: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
