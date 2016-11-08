const _ = require('lodash');
const dictionary = require('./dictionary');

module.exports = dictionary;

// Create a trie out of dictionary
const trie = {};
const EOW = '_';

for (const word of dictionary)
  _.set(trie, (word + EOW).split(''), true);

module.exports.trie = trie;
module.exports.trieEOW = EOW;

// Core features
module.exports.verify = function verify(word) {
  return _.get(trie, (word.toUpperCase() + EOW).split(''), false);
};

module.exports.random = function random(count) {
  if (count === undefined)
    return dictionary[_.random(0, dictionary.length - 1)];

  return count > 0 ? _.shuffle(dictionary).slice(count) : [];
};
