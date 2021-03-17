import express from "express";
import path from "path";
import cors from "cors";
import { create } from "./util/connection";

create();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = 3034;

// Cors
const corsOptions = {
  origin: "*", // All requests
  optionsSuccessStatus: 200, // 204 breaks some browsers
};

// Routers
const AuthRouter = require("./routes/Auth");
const GetRouter = require("./routes/Get");
const UploadRouter = require("./routes/Upload");
const UploadPostRouter = require("./routes/UploadPost");
const FollowRouter = require("./routes/Follow");
const LikeRouter = require("./routes/Like");
const CommentRouter = require("./routes/Comment");
const FeedRouter = require("./routes/Feed");

// Limits
const limiterMessage = {
  success: false,
  message: "Too many requests sent. Please try again later.",
};
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: limiterMessage,
});
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  message: limiterMessage,
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use("/", AuthRouter);
app.use("/", GetRouter);
app.use("/", UploadRouter);
app.use("/", UploadPostRouter);
app.use("/", FollowRouter);
app.use("/", LikeRouter);
app.use("/", CommentRouter);
app.use("/", FeedRouter);
app.use(limiter);
app.use("/login", authLimiter);
app.use("/create-user", authLimiter);
app.enable("trust proxy");
app.set("trust proxy", 1);

server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
