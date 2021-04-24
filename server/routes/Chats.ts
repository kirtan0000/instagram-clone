import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
const { valid_name } = require("../util/validate");
import { unixToDate, getUnix } from "../util/timestamp";
import filter from "../util/filter";

router.post("/send-chat/:username", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const username = req.params.username;
  let content = req.body?.content;

  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    username === undefined ||
    content === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  if (!valid_name(username)) {
    res.json({ success: false, message: "You are not following this user." });
    return;
  }

  if (
    content === "" ||
    !content.replace(/\s/g, "").length ||
    content.length < 1
  ) {
    res.json({
      success: false,
      message: "The chat must have 1 or more characters.",
    });
    return;
  }

  if (content.length > 70) {
    res.json({
      success: false,
      message: "The chat must have less than 70 characters.",
    });
    return;
  }

  const isValid = check_jwt_valid(jwt_token);
  let needs_new_jwt = [false, null];
  let user_name: string = "";

  // Get the name of the user
  if (isValid[0]) {
    user_name = isValid[1].username;
    const user_info_full = await run_query(
      rep([":REFRESH_TOKEN:"], [refresh_token], "get_user_info.sql")
    );

    user_name = user_info_full[0].username;
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
  }
  const isFollowing = await run_query(
    rep(
      [":USERNAME:", ":FROM:"],
      [username, user_name],
      "is_following_user.sql"
    )
  );
  if (!isFollowing.toString()) {
    res.json({ success: false, message: "You are not following this user." });
    return;
  }

  content = Buffer.from(content).toString("base64");

  await run_query(
    rep(
      [":USERNAME", ":TO:", ":TIMESTAMP:", ":CONTENT:"],
      [user_name, username, getUnix(), content],
      "chat_user.sql"
    )
  );

  const user_pfp_uri = await run_query(
    rep([":USERNAME:"], [user_name], "get_chat_pfp.sql")
  );

  const template: Object = {
    author: user_name,
    content: Buffer.from(content, "base64").toString(),
    timestamp: unixToDate(getUnix()),
    to: username,
    from: user_name,
    pfp: `${Buffer.from(user_pfp_uri[0].pfp, "base64").toString()}.jpg`,
  };

  req["app"]["io"].emit("new_message", template);

  !needs_new_jwt[0]
    ? res.json({
        success: true,
        message: "Success!",
        needs_new_jwt: false,
      })
    : res.json({
        success: true,
        message: "Success!",
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
      });
});

router.post("/chats/:username", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const username = req.params.username;

  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    username === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  if (!valid_name(username)) {
    res.json({ success: false, message: "You are not following this user." });
    return;
  }

  const isValid = check_jwt_valid(jwt_token);
  let needs_new_jwt = [false, null];
  let user_name: string = "";

  if (isValid[0]) {
    user_name = isValid[1].username;
    const user_info_full = await run_query(
      rep([":REFRESH_TOKEN:"], [refresh_token], "get_user_info.sql")
    );

    user_name = user_info_full[0].username;
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
  }
  const isFollowing = await run_query(
    rep(
      [":USERNAME:", ":FROM:"],
      [username, user_name],
      "is_following_user.sql"
    )
  );
  if (!isFollowing.toString()) {
    res.json({ success: false, message: "You are not following this user." });
    return;
  }

  let all_chats = await run_query(
    rep(
      [":TO:", ":FROM:", ":FROM:", ":TO:"],
      [username, user_name, user_name, username],
      "get_all_chats.sql"
    )
  );

  for (let chat_ in all_chats) {
    const chat = all_chats[chat_];
    chat["content"] = Buffer.from(chat["content"], "base64").toString();
    chat["timestamp"] = unixToDate(chat["timestamp"]);
    chat["pfp"] = `${Buffer.from(chat["pfp"], "base64").toString()}.jpg`;
  }

  !needs_new_jwt[0]
    ? res.json({
        success: true,
        message: "Success!",
        needs_new_jwt: false,
        all_chats,
        user_name,
      })
    : res.json({
        success: true,
        message: "Success!",
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
        all_chats,
        user_name,
      });
});

module.exports = router;
