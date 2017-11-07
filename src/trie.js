const dictionary = require('./dictionary')
const trie = {}

for (const word of dictionary) {
  let node = trie
  for (const letter of word) {
    let nextNode = node[letter]
    if (!nextNode) {
      nextNode = node[letter] = {}
    }
    node = nextNode
  }
  node._ = true
}

module.exports = trie
