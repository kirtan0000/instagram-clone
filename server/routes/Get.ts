import express, { Request, Response } from "express";
const router = express.Router();
import path from "path";
const rep = require("../util/replace_sql");
const run_query = require("../util/run_query");
import create_new_jwt from "../auth/create_new_jwt";
import check_jwt_valid from "../auth/check_jwt_valid";
const { valid_name } = require("../util/validate");
import { unixToDate } from "../util/timestamp";
import arrUnique from "../util/unique";

router.post("/get-my-info", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  if (jwt_token === undefined || refresh_token === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
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
      rep([":REFRESH_TOKEN:"], [refresh_token], "get_user_info.sql")
    );
    if (user_info_full[0]?.pfp === undefined) {
      res.json({ success: false, message: "User not found." });
      return;
    }
    user_pfp = `${Buffer.from(
      user_info_full[0]?.pfp,
      "base64"
    ).toString()}.jpg`;
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
    user_pfp = `${Buffer.from(user_info_full[0].pfp, "base64").toString()}.jpg`;
  }
  const user_posts = await run_query(
    rep([":USERNAME:"], [user_name], "get_user_posts.sql")
  );
  for (let _post in user_posts) {
    let post = user_posts[_post];
    post.title = Buffer.from(post.title, "base64").toString();
    post.id = Buffer.from(post.id, "base64").toString();
    post.timestamp = unixToDate(post.timestamp);
    post.image_id = Buffer.from(post.image_id, "base64").toString();
  }
  const user_posts_length = user_posts.length;
  let totalFollowers = await run_query(
    rep([":USERNAME:"], [user_name], "get_followers.sql")
  );
  let totalFollowing = await run_query(
    rep([":USERNAME:"], [user_name], "get_following.sql")
  );
  let totalFollowingCount = totalFollowing.length;
  let totalFollowersCount = totalFollowers.length;
  totalFollowers.from = totalFollowers.from_;
  delete totalFollowers.from_;
  totalFollowers.length === 0 ? (totalFollowers = []) : "";

  // Send different results depending on the status of the jwt token
  !needs_new_jwt[0]
    ? res.json({
        success: true,
        message: "Success!",
        user_name,
        user_pfp,
        user_posts,
        totalFollowersCount,
        totalFollowingCount,
        user_posts_length,
        needs_new_jwt: false,
      })
    : res.json({
        success: true,
        message: "Success!",
        user_name,
        user_pfp,
        user_posts,
        totalFollowersCount,
        totalFollowingCount,
        user_posts_length,
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
      });
});

router.post("/get-account/:username", async (req: Request, res: Response) => {
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;
  if (jwt_token === undefined || refresh_token === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }

  if (!valid_name(req.params.username)) {
    res.json({
      success: false,
      message: "The user does not exist.",
      exists: false,
    });
    return;
  }
  let isFollowing: boolean = false;
  const isValid = check_jwt_valid(jwt_token);
  let needs_new_jwt = [false, null];

  const account_info = await run_query(
    rep([":USERNAME:"], [req.params.username], "get_user_account.sql")
  );

  if (!account_info.toString()) {
    res.json({
      success: false,
      message: "The user does not exist.",
      exists: false,
    });
    return;
  }
  const user_name: string = account_info[0].username;
  const user_pfp: string = `${Buffer.from(
    account_info[0].pfp,
    "base64"
  ).toString()}.jpg`;
  let totalFollowers = await run_query(
    rep([":USERNAME:"], [req.params.username], "get_followers.sql")
  );
  let totalFollowersCount = totalFollowers.length;
  totalFollowers.from = totalFollowers.from_;
  delete totalFollowers.from_;
  totalFollowers.length === 0 ? (totalFollowers = []) : "";

  let isSelf: boolean = false;
  if (isValid[0]) {
    const isFollowingStr = await run_query(
      rep([":TO:", ":FROM:"], [user_name, isValid[1].username], "check_fol.sql")
    );
    if (isFollowingStr.toString()) isFollowing = true;
    if (user_name === isValid[1].username) isSelf = true;
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
    const isFollowingStr = await run_query(
      rep(
        [":TO:", ":FROM:"],
        [user_name, user_info_full[0].username],
        "check_fol.sql"
      )
    );
    if (isFollowingStr.toString()) isFollowing = true;
    if (user_name === user_info_full[0].username) isSelf = true;
  }
  const user_posts = await run_query(
    rep([":USERNAME:"], [user_name], "get_user_posts.sql")
  );
  const user_posts_length = user_posts.length;
  for (let _post in user_posts) {
    let post = user_posts[_post];
    post.title = Buffer.from(post.title, "base64").toString();
    post.id = Buffer.from(post.id, "base64").toString();
    post.timestamp = unixToDate(post.timestamp);
    post.image_id = Buffer.from(post.image_id, "base64").toString();
  }
  let totalFollowing = await run_query(
    rep([":USERNAME:"], [req.params.username], "get_following.sql")
  );
  let totalFollowingCount = totalFollowing.length;
  // Send different results depending on the status of the jwt token
  !needs_new_jwt[0]
    ? res.json({
        success: true,
        message: "Success!",
        user_name,
        user_posts,
        user_pfp,
        user_posts_length,
        exists: true,
        totalFollowingCount,
        needs_new_jwt: false,
        isFollowing,
        isSelf,
        totalFollowersCount,
      })
    : res.json({
        success: true,
        message: "Success!",
        user_name,
        user_posts,
        user_posts_length,
        user_pfp,
        exists: true,
        totalFollowingCount,
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
        isFollowing,
        isSelf,
        totalFollowersCount,
      });
});

router.get(
  "/get-user-followers/:username",
  async (req: Request, res: Response) => {
    if (!valid_name(req.params.username)) {
      res.json({
        success: false,
        message: "The user does not exist.",
        exists: false,
      });
      return;
    }

    const account_info = await run_query(
      rep([":USERNAME:"], [req.params.username], "get_user_account.sql")
    );

    if (!account_info.toString()) {
      res.json({
        success: false,
        message: "The user does not exist.",
        exists: false,
      });
      return;
    }

    let totalFollowers = await run_query(
      rep([":USERNAME:"], [req.params.username], "get_followers.sql")
    );
    let totalFollowersCount = totalFollowers.length;
    totalFollowers.length === 0 ? (totalFollowers = []) : "";
    let allFollowersFixed = [];
    for (let _follower in totalFollowers) {
      let follower = totalFollowers[_follower];
      let followerName = follower.from_;
      const follower_data = await run_query(
        rep([":USERNAME:"], [followerName], "get_user_account.sql")
      );
      allFollowersFixed.push({
        username: followerName,
        pfp: `${Buffer.from(follower_data[0].pfp, "base64").toString()}.jpg`,
      });
    }
    res.json({
      success: true,
      message: "Success!",
      followers: allFollowersFixed,
      count: totalFollowersCount,
      exists: true,
    });
  }
);

router.get(
  "/get-user-following/:username",
  async (req: Request, res: Response) => {
    if (!valid_name(req.params.username)) {
      res.json({
        success: false,
        message: "The user does not exist.",
        exists: false,
      });
      return;
    }

    const account_info = await run_query(
      rep([":USERNAME:"], [req.params.username], "get_user_account.sql")
    );

    if (!account_info.toString()) {
      res.json({
        success: false,
        message: "The user does not exist.",
        exists: false,
      });
      return;
    }

    let totalFollowing = await run_query(
      rep([":USERNAME:"], [req.params.username], "get_following.sql")
    );
    let totalFollowingCount = totalFollowing.length;
    totalFollowing.length === 0 ? (totalFollowing = []) : "";
    let allFollowingFixed = [];
    for (let _following in totalFollowing) {
      let following = totalFollowing[_following];
      let followingName = following.to_;
      const following_data = await run_query(
        rep([":USERNAME:"], [followingName], "get_user_account.sql")
      );
      allFollowingFixed.push({
        username: followingName,
        pfp: `${Buffer.from(following_data[0].pfp, "base64").toString()}.jpg`,
      });
    }
    res.json({
      success: true,
      message: "Success!",
      following: allFollowingFixed,
      count: totalFollowingCount,
      exists: true,
    });
  }
);

router.post("/get-post/:id", async (req: Request, res: Response) => {
  const postId = Buffer.from(req.params.id).toString("base64");
  let postData = await run_query(rep([":ID:"], [postId], "get_post_data.sql"));
  const jwt_token = req.body?.jwt_token;
  const refresh_token = req.body?.refresh_token;

  if (jwt_token === undefined || refresh_token === undefined) {
    res.json({ success: false, message: "Missing valid credentials." });
    return;
  }
  if (!postData.toString()) {
    res.json({
      success: false,
      exists: false,
      message: "The post does not exist.",
    });
    return;
  }
  try {
  postData = postData[0];
  postData.title = Buffer.from(postData.title, "base64").toString();
  postData.image_id = Buffer.from(postData.image_id, "base64").toString();
  postData.pfp = `${Buffer.from(postData.pfp, "base64").toString()}.jpg`;
  postData["image_url"] = postData.image_id;
  delete postData.image_id;
  postData.id = Buffer.from(postData.id, "base64").toString();
  postData.timestamp = unixToDate(postData.timestamp);
  } catch(error) {
    res.json({ success: false, message: "An error occured" });
    return;
  }
  const post_likes = await run_query(
    rep([":ID:"], [postData.id], "get_post_likes.sql")
  );
  postData["likes"] = post_likes.length;
  const isValid = check_jwt_valid(jwt_token);
  let user_name: string = "";
  let hadLiked: boolean = false;
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
  const likes = await run_query(
    rep(
      [":USERNAME:", ":ID:"],
      [user_name, postData.id],
      "get_user_liked-post.sql"
    )
  );
  if (!likes.toString()) hadLiked = false;
  else hadLiked = true;
  const all_comments = await run_query(
    rep(
      [":ID:"],
      [Buffer.from(postId, "base64").toString()],
      "get_post_comments.sql"
    )
  );
  for (let comment_ in all_comments) {
    let comment = all_comments[comment_];
    comment["pfp"] = `${Buffer.from(comment["pfp"], "base64").toString()}.jpg`;
    comment["date"] = unixToDate(comment["timestamp"]);
    comment["content"] = Buffer.from(comment["content"], "base64").toString();

    delete comment.timestamp;
    delete comment.post_id;
  }
  postData["comments"] = all_comments;
  postData["comment_count"] = all_comments.length;

  !needs_new_jwt[0]
    ? res.json({
        success: true,
        exists: true,
        message: "Success!",
        data: postData,
        hasUserLiked: hadLiked,
        needs_new_jwt: false,
      })
    : res.json({
        success: true,
        exists: true,
        message: "Success!",
        data: postData,
        hasUserLiked: hadLiked,
        needs_new_jwt: true,
        jwt_token: needs_new_jwt[1],
      });
});

router.get("/search-user/:query", async (req: Request, res: Response) => {
  const query = req.params.query;
  if (!valid_name(query)) {
    res.json({
      success: true,
      message: "Success!",
      results: [],
      amount: 0,
    });
    return;
  }
  let results = await run_query(
    rep([":QUERY:"], [`${query}%`], "search_user.sql")
  );
  results = arrUnique(results);

  const amount = results.length;

  for (let result in results) {
    results[result]["pfp"] = Buffer.from(
      results[result]["pfp"],
      "base64"
    ).toString();
    results[result]["pfp"] += ".jpg";
  }
  res.json({ success: true, message: "Success!", results, amount });
});

module.exports = router;
