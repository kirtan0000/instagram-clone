import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
import { unixToDate } from "../util/timestamp";
import arrUnique from "../util/unique";
import shuffle from "../util/shuffle";

router.post("/get-my-feed", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  if (jwt_token === undefined || refresh_token === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
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
  const my_following = await run_query(
    rep([":USERNAME:"], [user_name], "get_following.sql")
  );
  let my_full_feed = [];
  let my_un_feed = [];
  let my_p_feed = [];
  for (let following_ in my_following) {
    let following = my_following[following_];
    const new_posts = await run_query(
      rep(
        [":USERNAME:"],
        [following["to_"]],
        "get_personal_followers_posts.sql"
      )
    );
    // Personalized
    for (let new_post_ in new_posts) {
      let new_post = new_posts[new_post_];
      new_post["id"] = Buffer.from(new_post["id"], "base64").toString();
      let hadLikedPost: boolean = false;
      let likeCount: number = 0;
      let commentAmount: number = 0;
      new_post["image_id"] = Buffer.from(
        new_post["image_id"],
        "base64"
      ).toString();
      new_post["title"] = Buffer.from(new_post["title"], "base64").toString();
      new_post["pfp"] = `${Buffer.from(
        new_post["pfp"],
        "base64"
      ).toString()}.jpg`;
      new_post["date"] = unixToDate(new_post["timestamp"]);
      delete new_post.timestamp;
      const likes = await run_query(
        rep(
          [":USERNAME:", ":ID:"],
          [user_name, new_post.id],
          "get_user_liked-post.sql"
        )
      );
      const post_likes = await run_query(
        rep([":ID:"], [new_post["id"]], "get_post_likes.sql")
      );
      likeCount = post_likes.length;
      new_post["like_count"] = likeCount;
      if (!likes.toString()) hadLikedPost = false;
      else hadLikedPost = true;
      new_post["hadLiked"] = hadLikedPost;
      const all_comments = await run_query(
        rep([":ID:"], [new_post.id], "get_post_comments.sql")
      );
      commentAmount = all_comments.length;
      new_post["comment_count"] = commentAmount;

      my_p_feed.push(new_post);
    }
  }
  my_p_feed = shuffle(my_p_feed);

  for (let j in my_p_feed) {
    my_full_feed.push(my_p_feed[j]);
  }
  // Unpersonalized
  const all_posts_not_mine = await run_query(rep([], [], "get_all_posts.sql"));
  for (let new_post__ in all_posts_not_mine) {
    let new_post = all_posts_not_mine[new_post__];
    new_post["id"] = Buffer.from(new_post["id"], "base64").toString();
    let hadLikedPost: boolean = false;
    let likeCount: number = 0;
    let commentAmount: number = 0;
    new_post["image_id"] = Buffer.from(
      new_post["image_id"],
      "base64"
    ).toString();
    new_post["title"] = Buffer.from(new_post["title"], "base64").toString();
    new_post["pfp"] = `${Buffer.from(
      new_post["pfp"],
      "base64"
    ).toString()}.jpg`;
    new_post["date"] = unixToDate(new_post["timestamp"]);
    delete new_post.timestamp;
    const likes = await run_query(
      rep(
        [":USERNAME:", ":ID:"],
        [user_name, new_post.id],
        "get_user_liked-post.sql"
      )
    );
    const post_likes = await run_query(
      rep([":ID:"], [new_post["id"]], "get_post_likes.sql")
    );
    likeCount = post_likes.length;
    new_post["like_count"] = likeCount;
    if (!likes.toString()) hadLikedPost = false;
    else hadLikedPost = true;
    new_post["hadLiked"] = hadLikedPost;
    const all_comments = await run_query(
      rep([":ID:"], [new_post.id], "get_post_comments.sql")
    );
    commentAmount = all_comments.length;
    new_post["comment_count"] = commentAmount;
    my_un_feed.push(new_post);
  }
  my_un_feed = shuffle(my_un_feed);
  for (let j in my_un_feed) {
    my_full_feed.push(my_un_feed[j]);
  }
  my_full_feed = arrUnique(my_full_feed);

  !needs_new_jwt[0]
    ? res.json({
        success: true,
        message: "Success!",
        data: my_full_feed,
        needs_new_jwt: false,
      })
    : res.json({
        success: true,
        message: "Success!",
        data: my_full_feed,
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
      });
});

module.exports = router;
