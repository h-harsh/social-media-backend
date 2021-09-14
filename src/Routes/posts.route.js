const express = require("express");
const app = express();
const router = express.Router();
const { authVerify } = require("../utils/authVerify");
const { User } = require("../Models/user.model");
const { Posts } = require("../Models/posts.model");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // cb(null, new Date().toString() + file.originalname);
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/new/:text")
  // Create a post
  .post(authVerify, upload.single("post-image"), async (req, res) => {
    try {
      const { userId } = req.user;
      // const postData = req.body;
      console.log(req.file);
      const { text } = req.params;
      const currentUser = await User.findById(userId);
      const NewPost = new Posts({
        text: text,
        author: userId,
        authorName: currentUser.fullName,
        image: req.file.path,
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
  const currentUser = await User.findById(userId);

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

router.route("/delete/:postId").delete(authVerify, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;
    const currentPost = await Posts.findById(postId);
    const delPost = await Posts.findByIdAndDelete(postId);
    const currentUser = await User.findById(userId);
    await currentUser.posts.pull(postId);
    await currentUser.save();
    res.json({status:"success", newPost:currentPost})
  } catch (error) {
    res.json({success:"false", error:error.message})
  }
});

module.exports = router;
