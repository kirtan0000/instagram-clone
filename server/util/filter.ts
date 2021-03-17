const Filter = require("bad-words"),
  filter_ = new Filter();

const filter = (bad_word: string) => filter_.clean(bad_word);

export default filter;
