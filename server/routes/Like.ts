import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
const { valid_name } = require("../util/validate");

router.post("/like/:id", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const id = req.params.id;
  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    id === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  const post_info = await run_query(
    rep([":ID:"], [Buffer.from(id).toString("base64")], "get_post_data.sql")
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
  const isAlreadyLiked = await run_query(
    rep([":ID:", ":USERNAME:"], [id, user_name], "get_likes.sql")
  );
  if (isAlreadyLiked.toString()) {
    res.json({
      success: false,
      message: "You have already liked this post.",
    });
    return;
  }

  try {
    await run_query(
      rep([":USERNAME:", ":ID:"], [user_name, id], "add_like.sql")
    );

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
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

router.post("/unlike/:id", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  const id = req.params.id;
  if (
    jwt_token === undefined ||
    refresh_token === undefined ||
    id === undefined
  ) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  const post_info = await run_query(
    rep([":ID:"], [Buffer.from(id).toString("base64")], "get_post_data.sql")
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
  const isAlreadyLiked = await run_query(
    rep([":ID:", ":USERNAME:"], [id, user_name], "get_likes.sql")
  );
  if (!isAlreadyLiked.toString()) {
    res.json({
      success: false,
      message: "You have not liked this post.",
    });
    return;
  }

  try {
    await run_query(
      rep([":USERNAME:", ":ID:"], [user_name, id], "remove_like.sql")
    );

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
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
