const trie = require('./trie')

// A variant of the Wagner-Fischer algorithm is implemented here.
// https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm
module.exports = function suggest (string, distance = 2) {
  if (typeof string !== 'string') {
    return []
  }

  string = string.toUpperCase()
  const baseLength = string.length
  const results = []

  const initColumn = []
  for (let i = 0; i < baseLength; ++i) {
    initColumn.push(i + 1)
  }

  function getNextColumn (currColumn, column, node) {
    const nextColumn = []
    let above = column + 1
    let diag = column
    let minDist = -1

    for (let row = 0; row < baseLength; ++row) {
      const cost = node === string[row] ? 0 : 1
      const left = currColumn[row]
      const currDist = Math.min(
        above + 1,   // Deletion
        left + 1,    // Insertion
        diag + cost  // Substitution
      )

      above = currDist
      diag = left
      nextColumn[row] = currDist

      if (minDist === -1 || currDist < minDist) {
        minDist = currDist
      }
    }

    return minDist > distance ? undefined : nextColumn
  }

  function check (node, currColumn, column, path) {
    for (const subNode in node) {
      if (subNode === '_' && currColumn[baseLength - 1] <= distance) {
        results.push(path)
      } else {
        const nextColumn = getNextColumn(currColumn, column, subNode)
        if (nextColumn) {
          check(node[subNode], nextColumn, column + 1, path + subNode)
        }
      }
    }
  }

  check(trie, initColumn, 0, '')
  return results.sort()
}
