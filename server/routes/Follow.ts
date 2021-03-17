import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
const { valid_name } = require("../util/validate");

router.post("/follow/:username", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const user_name = req.params.username;
  if (jwt_token === undefined || refresh_token === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }
  if (!valid_name(user_name)) {
    res.json({
      success: false,
      message: "The user does not exist.",
      exists: false,
    });
    return;
  }

  const account_info = await run_query(
    rep([":USERNAME:"], [user_name], "get_user_account.sql")
  );

  if (!account_info.toString()) {
    res.json({
      success: false,
      message: "The user does not exist.",
      exists: false,
    });
    return;
  }

  const isValid = check_jwt_valid(jwt_token);
  let user_name_from: string = "";
  let needs_new_jwt = [false, null];
  // Get the info of the user
  if (isValid[0]) user_name_from = isValid[1].username;
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
    user_name_from = user_info_full[0].username;
  }
  const isAlreadyFollowing = await run_query(
    rep([":TO:", ":FROM:"], [user_name, user_name_from], "get_follow.sql")
  );
  if (isAlreadyFollowing.toString()) {
    res.json({
      success: false,
      message: "You are already following this user.",
    });
    return;
  }
  try {
    await run_query(
      rep([":TO:", ":FROM:"], [user_name, user_name_from], "add_follow.sql")
    );
    res.json({ success: true, message: "Success!" });
  } catch (error) {
    res.json({
      success: false,
      message: "An unknown error occured while following the requested user.",
    });
  }
});

router.post("/unfollow/:username", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const user_name = req.params.username;
  if (jwt_token === undefined || refresh_token === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }
  if (!valid_name(user_name)) {
    res.json({
      success: false,
      message: "The user does not exist.",
      exists: false,
    });
    return;
  }

  const account_info = await run_query(
    rep([":USERNAME:"], [user_name], "get_user_account.sql")
  );

  if (!account_info.toString()) {
    res.json({
      success: false,
      message: "The followed user does not exist.",
      exists: false,
    });
    return;
  }

  const isValid = check_jwt_valid(jwt_token);
  let user_name_from: string = "";
  let needs_new_jwt = [false, null];
  // Get the info of the user
  if (isValid[0]) user_name_from = isValid[1].username;
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
    user_name_from = user_info_full[0].username;
  }
  const isAlreadyFollowing = await run_query(
    rep([":TO:", ":FROM:"], [user_name, user_name_from], "get_follow.sql")
  );
  if (!isAlreadyFollowing.toString()) {
    res.json({
      success: false,
      message: "You are not following this user.",
    });
    return;
  }
  try {
    await run_query(
      rep([":TO:", ":FROM:"], [user_name, user_name_from], "remove_follow.sql")
    );
    res.json({ success: true, message: "Success!" });
  } catch (error) {
    res.json({
      success: false,
      message: "An unknown error occured while unfollowing the requested user.",
    });
  }
});

module.exports = router;
