const express = require("express");
const app = express();
const router = express.Router();
const { authVerify } = require("../utils/authVerify");
const { User } = require("../Models/user.model");
const { Posts } = require("../Models/posts.model");

// app.use(authVerify)

router
  .route("/new")
  // Create a post
  .post(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const postData = req.body;
      const currentUser = await User.findById(userId);
      const NewPost = new Posts({
        ...postData,
        author: userId,
        authorName: currentUser.fullName,
      });
      await NewPost.save();
      currentUser.posts.push(NewPost._id);
      await currentUser.save();
      res.json({ message: "Posted successfully", newPost: NewPost });
    } catch (error) {
      console.log(error, "ballo");
      res.json({ message: error.message });
    }
  });

// sending post
router.route("/:userId").post(authVerify, async (req, res) => {
  // const {userId} = req.user
  const { userId } = req.params;
  console.log(userId);
  const currentUser = await User.findOne({ _id: userId }).populate({
    path: "posts",
    model: "Posts",
  });
  res.json({ message: "posts fetched success", allPosts: currentUser.posts });
});

// Like and unlike
// have to send post id in params bas
router.route("/like/:postId").post(authVerify, async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;
  const currentPost = await Posts.findById(postId);
  const otherUser = await User.findById(currentPost.author);
  const tempObj = currentPost.likes.filter((item) => item == userId);
  if (!tempObj.length) {
    currentPost.likes.push(userId);
    otherUser.notifications.push(`${currentPost.authorName} liked your post`);
    await otherUser.save();
    await currentPost.save();
    res.json({ status: "success", data: currentPost.likes, postId });
  } else {
    currentPost.likes.pull(userId);
    await currentPost.save();
    res.json({
      message: "unliked Successfully",
      data: currentPost.likes,
      postId,
    });
  }
});

router.route("/share/:postId").post(authVerify, async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;
  const currentPost = await Posts.findById(postId);
  currentPost.sharedBy.push(userId);
  await currentPost.save();
  const currentUser = await User.findById(userId);
  await currentUser.posts.push(postId);
  await currentUser.save();
  res.json({ message: "post shared success", post: currentPost });
});

router.route("/comment/:postId").post(authVerify, async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const { comment } = req.body;
  const currentUser = await User.findById(userId)
  
  const currentPost = await Posts.findById(postId);
  currentPost.comments.push({
    user: userId,
    fullName: currentUser.fullName,
    comment: comment,
  });
  await currentPost.save();
  res.json({
    message: "apka comment hogya",
    commentsData: currentPost.comments,
    postId,
  });
});

module.exports = router;
