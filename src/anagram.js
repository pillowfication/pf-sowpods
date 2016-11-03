const _ = require('lodash');
const sowpods = require('./sowpods');
const EOW = sowpods.trie.EOW;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function anagram(chars) {
  let results = [];
  let bank = chars.toUpperCase().split('');
  let wildcards = _.remove(bank, (char) => !_.includes(ALPHABET, char)).length;

  (function check(bank, wildcards, trieNode, path) {
    Object.keys(trieNode).forEach((node) => {
      if (node === EOW)
        results.push(path);
      else {
        let index = bank.indexOf(node);
        if (index !== -1) {
          let _bank = bank.slice();
          _bank.splice(index, 1);
          check(_bank, wildcards, trieNode[node], path + node);
        } else if (wildcards) {
          check(bank, wildcards-1, trieNode[node], path + node);
        }
      }
    });
  })(bank, wildcards, sowpods.trie, '');

  return _.sortBy(results);
};
