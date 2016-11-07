const sowpods = require('./sowpods');

// TODO: optimize on trie to avoid repeated distance calculations

module.exports = function suggest(string, distance = 2) {
  string = string.toUpperCase();
  const baseLength = string.length;
  const result = [];

  loop: for (let word of sowpods) {
    const targetLength = word.length;

    if (Math.abs(baseLength-targetLength) > distance)
      continue;

    let prevColumn = [];
    let currColumn = [];

    for (let col = 0; col < targetLength; ++col) {
      let minDist = -1;
      for (let row = 0; row < baseLength; ++row) {
        const cost = string[row] === word[col] ? 0 : 1;
        const above = (row === 0 ? col+1 : currColumn[row-1]) + 1;
        const left = (col === 0 ? row+1 : prevColumn[row]) + 1;
        const diag = (row === 0 ? col : (col === 0 ? row : prevColumn[row-1])) + cost;

        const currDist = Math.min(above, left, diag);
        if (minDist === -1 || currDist < minDist)
          minDist = currDist;
        currColumn[row] = currDist;
      }

      if (minDist > distance)
        continue loop;

      [prevColumn, currColumn] = [currColumn, prevColumn];
    }

    const dist = prevColumn[baseLength-1];
    if (dist <= distance)
      result.push(word);
  }

  return result;
};
