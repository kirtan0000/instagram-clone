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

router.post("/upload-pfp", async (req: Request, res: Response) => {
  let uuidFile = generateId();
  const storage = multer.diskStorage({
    destination: "./tmp/pfps/",
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
    limits: { fileSize: 10 * 1024 * 1024 },
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
  }).single("pfp");

  upload(req, res, async () => {
    try {
      await fs.renameSync(
        path.join(__dirname, `..\\tmp\\pfps\\${uuidFile}`),
        path.join(__dirname, `..\\public\\pfps\\${uuidFile}`)
      );
      await run_query(
        rep(
          [":ID:"],
          [Buffer.from(uuidFile.split(".")[0]).toString("base64")],
          "upload_pfp.sql"
        )
      );
    } catch (error) {
      res.json({
        success: false,
        message: "An unknown error occured.",
      });

      await fs.unlinkSync(path.join(__dirname, `..\\tmp\\pfps\\${uuidFile}`));
      return;
    }
    res.json({
      success: true,
      message: "Success",
      id: uuidFile.split(".")[0],
    });
  });
});

router.post("/change-pfp", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const id = req.body?.id;
  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    id === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }
  const imageExists = await run_query(
    rep([":ID:"], [Buffer.from(id).toString("base64")], "get_pfp.sql")
  );
  if (!imageExists.toString()) {
    res.json({ success: false, message: "The image does not exist." });
    return;
  }
  const isValid = check_jwt_valid(jwt_token);
  let user_name: string = "";
  let needs_new_jwt = [false, null];

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

  const pfpUri = Buffer.from(
    `${req.secure ? "https:" : "http:"}//${req.get("host")}/pfps/${id}`
  ).toString("base64");

  await run_query(
    rep([":URI:", ":USERNAME:"], [pfpUri, user_name], "update_pfp.sql")
  );
  await run_query(
    rep([":ID:"], [imageExists[0].id], "delete_temp_pfp.sql")
  );

  !needs_new_jwt[0]
    ? res.json({
        success: true,
        message: "Success!",
        url: `${Buffer.from(pfpUri, "base64").toString()}.jpg`,
        needs_new_jwt: false,
      })
    : res.json({
        success: true,
        message: "Success!",
        url: `${Buffer.from(pfpUri, "base64").toString()}.jpg`,
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
      });
});

module.exports = router;
