import { con } from "./connection";

module.exports = (
  what_to_rep: Array<string>,
  data: Array<string>,
  file: string
) => {
  const fs = require("fs");
  const path = require("path");
  let query = fs
    .readFileSync(path.join(__dirname, `../sql/${file}`))
    .toString()
    .replace("\n", "");
  for (let i = 0; i < what_to_rep.length; i++) {
    query = query.replace(what_to_rep[i], con.escape(data[i]));
  }
  return query;
};
