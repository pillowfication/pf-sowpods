const _ = require('lodash');
const sowpods = require('./sowpods');
const EOW = sowpods.trieEOW;

module.exports = function suggest(string, distance = 2) {
  string = string.toUpperCase();
  const baseLength = string.length;
  const results = [];

  const initColumn = [];
  for (let i = 0; i < baseLength; ++i)
    initColumn.push(i+1);

  function getNextColumn(currColumn, col, node) {
    const nextColumn = [];
    let above = col+1;
    let diag = col;
    let minDist = -1;

    for (let row = 0; row < baseLength; ++row) {
      const cost = node === string[row] ? 0 : 1;
      const left = currColumn[row];
      const currDist = Math.min(
        above + 1,   // Deletion
        left + 1,    // Insertion
        diag + cost  // Substitution
      );

      above = currDist;
      diag = left;
      nextColumn[row] = currDist;

      if (minDist === -1 || currDist < minDist)
        minDist = currDist;
    }

    return minDist > distance ? undefined : nextColumn;
  }

  (function check(trieNode, currColumn, col, path) {
    for (const node of Object.keys(trieNode)) {
      if (node === EOW && currColumn[baseLength-1] <= distance)
        results.push(path);
      else {
        const nextColumn = getNextColumn(currColumn, col, node);
        if (nextColumn)
          check(trieNode[node], nextColumn, col+1, path+node);
      }
    }
  })(sowpods.trie, initColumn, 0, '');

  return _.sortBy(results);
};
