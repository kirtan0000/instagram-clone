import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt_new_user from "../auth/create_new_jwt_new_user";
const multer = require("multer");
import fs from "fs";
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
import { v4 as uuidv4 } from "uuid";
import generateId from "../util/generateId";
import { getUnix } from "../util/timestamp";

router.post("/upload-post-image", async (req: Request, res: Response) => {
  let uuidFile = generateId();
  const storage = multer.diskStorage({
    destination: "./tmp/posts/",
    filename: function (req: Request, file: any, cb: any) {
      if (
        path.extname(file.originalname) === undefined ||
        path.extname(file.originalname) === null
      ) {
        res.json({ success: false, message: "Only images are allowed." });
        return;
      }
      uuidFile = `${uuidFile}.jpg`;
      cb(null, uuidFile);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    onError: function (err: any, next: any) {
      res.json({
        success: false,
        message: "File too large or system failed uploading.",
      });
      next(err);
    },
    fileFilter: function (req: Request, file: any, cb: any) {
      var ext = path.extname(file.originalname);
      if (ext !== ".png" && ext.toLowerCase() !== ".jpg" && ext !== ".jpeg") {
        res.json({ success: false, message: "Only images are allowed." });
        return;
      }
      cb(null, true);
    },
  }).single("post");

  upload(req, res, async () => {
    try {
      await fs.renameSync(
        path.join(__dirname, `../tmp/posts/${uuidFile}`),
        path.join(__dirname, `../public/posts/${uuidFile}`)
      );
    } catch (error) {
      res.json({
        success: false,
        message: "An unknown error occured.",
      });

      await fs.unlinkSync(path.join(__dirname, `../tmp/posts/${uuidFile}`));
      return;
    }
    const imgUri = `${req.secure ? "https:" : "http:"}//${req.get("host")}/${
      req.get("host") === "localhost:3034" ? `` : `api/`
    }posts/${uuidFile.split(".")[0]}.jpg`;
    res.json({
      success: true,
      message: "Success",
      uri: imgUri,
    });
  });
});

router.post("/upload-post", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  let img_url = req.body?.img_url;
  let post_title = req.body?.title;

  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    img_url === undefined ||
    post_title === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  img_url = Buffer.from(img_url).toString("base64");
  post_title = Buffer.from(post_title).toString("base64");
  const decoded_post_title = Buffer.from(post_title, "base64").toString();
  if (
    post_title === "" ||
    !decoded_post_title.replace(/\s/g, "").length ||
    post_title.length < 3
  ) {
    res.json({
      success: false,
      message: "The title must have 3 or more characters.",
    });
    return;
  }

  const isValid = check_jwt_valid(jwt_token);
  let user_name: string = "";
  let needs_new_jwt = [false, null];
  // Get the info of the user
  if (isValid[0]) user_name = isValid[1].username;
  else {
    const new_jwt = await create_new_jwt(refresh_token);

    if (!new_jwt.success) {
      res.json({ success: false, message: new_jwt.message });
      return;
    }
    needs_new_jwt = [true, new_jwt.new_jwt];
    const user_info_full = await run_query(
      rep([":REFRESH_TOKEN:"], [refresh_token], "get_user_info.sql")
    );
    user_name = user_info_full[0].username;
  }

  const post_id = Buffer.from(generateId()).toString("base64");
  const currentTimestamp = getUnix();
  try {
    await run_query(
      rep(
        [":ID:", ":IMG_URL:", ":TITLE:", ":USERNAME:", ":TIMESTAMP:"],
        [post_id, img_url, post_title, user_name, currentTimestamp],
        "create_new_post.sql"
      )
    );
    !needs_new_jwt[0]
      ? res.json({
          success: true,
          message: "Success!",
          id: Buffer.from(post_id, "base64").toString(),
          needs_new_jwt: false,
        })
      : res.json({
          success: true,
          message: "Success!",
          id: Buffer.from(post_id, "base64").toString(),
          needs_new_jwt: true,
          jwt_token: needs_new_jwt[1],
        });
  } catch (error) {
    res.json({
      success: false,
      message: "An unknown error occured. Please try again!",
    });
  }
});

module.exports = router;
