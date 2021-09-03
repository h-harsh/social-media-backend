const express = require("express");
const { dbConnector } = require("./database/dbConnector");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());


const user = require("./Routes/userAuth.route");
const post = require("./Routes/posts.route");
const friends = require("./Routes/friends.route");
const feed = require("./Routes/feed.route");
const notifications = require("./Routes/notifications.route");

dbConnector();

app.use("/user", user);
app.use("/post", post);
app.use("/friends", friends);
app.use("/feed", feed);
app.use("/notifications", notifications);

app.get("/", (req, res) => {
  res.send("hey welcome to Fine-socials server !");
});


// For errors and not found pages
app.use((req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: "route not found on server, please check",
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      success: false,
      message: "error occured, see the errMessage key for more details",
      errorMessage: err.message,
    });
});

app.listen(process.env.PORT || port, () => {
  console.log(` app listening on port ${port}!`);
});
