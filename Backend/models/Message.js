const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
    text: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Message", MessageSchema);
