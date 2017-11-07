const trie = require('./trie')

module.exports = function verify (word) {
  if (typeof word !== 'string') {
    return false
  }

  let node = trie
  for (const letter of word.toUpperCase()) {
    node = node[letter]
    if (!node) {
      return false
    }
  }
  return node._ === true
}
