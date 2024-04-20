const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    hasLiked: { type: Boolean, default: true, required: true },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Like = model("Like", likeSchema);

module.exports = Like;