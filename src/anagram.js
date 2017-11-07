const trie = require('./trie')
const isLetter = String.prototype.includes.bind('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

module.exports = function anagram (chars) {
  if (typeof chars !== 'string') {
    return []
  }

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
      if (subNode === '_') {
        results.push(path)
      } else {
        const index = bank.indexOf(subNode)
        if (index !== -1) {
          const _bank = bank.slice()
          _bank.splice(index, 1)
          check(_bank, wildcards, node[subNode], path + subNode)
        } else if (wildcards) {
          check(bank, wildcards - 1, node[subNode], path + subNode)
        }
      }
    }
  }

  check(bank, wildcards, trie, '')
  return results.sort()
}
