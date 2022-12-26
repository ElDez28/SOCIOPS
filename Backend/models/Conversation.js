const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ConversationSchema.virtual("messages", {
  ref: "Message",
  foreignField: "conversationId",
  localField: "_id",
});
module.exports = mongoose.model("Conversation", ConversationSchema);
