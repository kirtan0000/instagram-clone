import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const passwordHash = require("password-hash");
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
const { valid_name } = require("../util/validate");
import { unixToDate, getUnix } from "../util/timestamp";
import generateId from "../util/generateId";
import filter from "../util/filter";

router.post("/comment/:id", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const post_id = req.params.id;
  const content = req.body?.content;

  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    post_id === undefined ||
    content === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  if (
    content === "" ||
    !content.replace(/\s/g, "").length ||
    content.length < 1
  ) {
    res.json({
      success: false,
      message: "The comment must have 1 or more characters.",
    });
    return;
  }

  if (content.length > 70) {
    res.json({
      success: false,
      message: "The comment must have less than 70 characters.",
    });
    return;
  }

  const post_info = await run_query(
    rep(
      [":ID:"],
      [Buffer.from(post_id).toString("base64")],
      "get_post_data.sql"
    )
  );

  if (!post_info.toString()) {
    res.json({
      success: false,
      message: "The post does not exist.",
    });
    return;
  }
  const isValid = check_jwt_valid(jwt_token);
  let user_name: string = "";
  let user_pfp: string = "";
  let needs_new_jwt = [false, null];
  // Get the info of the user
  if (isValid[0]) {
    user_name = isValid[1].username;
    const user_info_full = await run_query(
      rep([":USERNAME:"], [user_name], "get_user_account.sql")
    );
    user_pfp = user_info_full[0].pfp;
  } else {
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
    user_pfp = user_info_full[0].pfp;
  }
  user_pfp = `${Buffer.from(user_pfp, "base64").toString()}.jpg`;
  const comment_id = generateId();
  const template = {
    author: user_name,
    id: comment_id,
    post_id,
    content: filter(content),
    pfp: user_pfp,
    date: unixToDate(getUnix()),
  };

  try {
    await run_query(
      rep(
        [":USERNAME:", ":ID:", ":CONTENT:", ":POST_ID:", ":TIME:"],
        [
          template.author,
          template.id,
          Buffer.from(template.content).toString("base64"), // Emojis only work in base64 :(
          template.post_id,
          getUnix(),
        ],
        "create_comment.sql"
      )
    );
    !needs_new_jwt[0]
      ? res.json({
          success: true,
          message: "Success!",
          needs_new_jwt: false,
          data: template,
        })
      : res.json({
          success: true,
          message: "Success!",
          needs_new_jwt: true,
          jwt_token: needs_new_jwt[1],
          data: template,
        });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
