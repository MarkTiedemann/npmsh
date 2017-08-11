module.exports = prefix => string =>
  string.startsWith(prefix)
    ? string.substr(prefix.length)
    : string