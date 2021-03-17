// Unique Json Array :D
const arrUnique = (obj_: any) => {
  let uniques = [];
  let stringify = {};
  for (let i = 0; i < obj_.length; i++) {
    let keys = Object.keys(obj_[i]);
    keys.sort((a: any, b: any) => {
      return a - b;
    });
    let str = "";
    for (let j = 0; j < keys.length; j++) {
      str += JSON.stringify(keys[j]);
      str += JSON.stringify(obj_[i][keys[j]]);
    }
    if (!stringify.hasOwnProperty(str)) {
      uniques.push(obj_[i]);
      stringify[str] = true;
    }
  }
  return uniques;
};

export default arrUnique;
