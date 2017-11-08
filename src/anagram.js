const trie = require('./trie')
const isLetter = String.prototype.includes.bind('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

module.exports = function anagram (chars) {
  if (typeof chars !== 'string') {
    return []
  }

  // Filter for only the letters, and count everything else as a wildcard
  const results = []
  const bank = []
  let wildcards = 0

  for (const char of chars.toUpperCase()) {
    if (isLetter(char)) {
      bank.push(char)
    } else {
      ++wildcards
    }
  }

  function check (bank, wildcards, node, path) {
    for (const subNode in node) {
      // If the current path reached an EOW, then an anagram was found
      if (subNode === '_') {
        results.push(path)

      // Otherwise, try to keep walking down nodes
      } else {
        const index = bank.indexOf(subNode)
        if (index !== -1) {          // First check if the letter was in `bank`
          const _bank = bank.slice()
          _bank.splice(index, 1)
          check(_bank, wildcards, node[subNode], path + subNode)
        } else if (wildcards) {      // Then see if any wildcards remain
          check(bank, wildcards - 1, node[subNode], path + subNode)
        }
      }
    }
  }

  check(bank, wildcards, trie, '')
  return results.sort()
}
