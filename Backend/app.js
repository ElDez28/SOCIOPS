const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const conversationsRouter = require("./routes/conversationRouter");
const messagesRouter = require("./routes/messagesRoutes");
const commentsRouter = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
dotenv.config({ path: `${__dirname}/config.env` });

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(`/public/images`, express.static(path.join("public", "images")));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/conversations", conversationsRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/comments", commentsRouter);

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(err);
    });
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
});
module.exports = app;
