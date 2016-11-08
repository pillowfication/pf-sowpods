const _ = require('lodash');
const sowpods = require('./sowpods');
const EOW = sowpods.trieEOW;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function anagram(chars) {
  const results = [];
  const bank = chars.toUpperCase().split('');
  const wildcards = _.remove(bank, (char) => !_.includes(ALPHABET, char)).length;

  (function check(bank, wildcards, trieNode, path) {
    for (const node of Object.keys(trieNode)) {
      if (node === EOW)
        results.push(path);
      else {
        const index = bank.indexOf(node);
        if (index !== -1) {
          const _bank = bank.slice();
          _bank.splice(index, 1);
          check(_bank, wildcards, trieNode[node], path + node);
        } else if (wildcards) {
          check(bank, wildcards-1, trieNode[node], path + node);
        }
      }
    }
  })(bank, wildcards, sowpods.trie, '');

  return _.sortBy(results);
};
