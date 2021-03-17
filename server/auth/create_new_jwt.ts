const create_new_jwt = async (refresh_token: string) => {
  const jwt = require("jsonwebtoken");
  const rep = require("../util/replace_sql");
  const run_query = require("../util/run_query");
  const enviromentVars = require("dotenv").config().parsed;
  let user_refresh = await run_query(
    rep([":REFRESH_TOKEN:"], [refresh_token], "get_user_info.sql")
  );
  if (!user_refresh.toString())
    return { success: false, message: "User Not Found!" };
  else {
    let user_email = user_refresh[0].email;
    let user_name = user_refresh[0].username;
    let new_jwt = jwt.sign(
      { email: user_email, username: user_name },
      enviromentVars.JWTKEY.toString(),
      { expiresIn: 600 } // 10 Mins
    );
    try {
      await run_query(
        rep(
          [":NEW_JWT:", ":USER_EMAIL:"],
          [new_jwt, user_email],
          "update_jwt.sql"
        )
      );
      return { success: true, new_jwt };
    } catch (error) {
      return { success: false, message: "An unknown error occured." };
    }
  }
};

export default create_new_jwt;
