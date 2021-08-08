const mongoose = require("mongoose");

const PostsSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorName:String,
  text: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      fullName: String,
      comment: String,
    },
  ],
  sharedBy:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true});

const Posts = mongoose.model("Posts", PostsSchema);

module.exports = { Posts };
