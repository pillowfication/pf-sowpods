'use strict';

var dictionary = require('./dictionary');
var undefined;

var i, j, l = dictionary.length;

// Create a trie out of dictionary
var trie = {}, t, n, w, k;
for (i = 0; i < l; ++i) {
  for (t = trie, j = 0, w = dictionary[i], k = w.length; j < k; ++j)
    t = t[n = w[j]] || (t[n] = {});
  t._ = true;
}

module.exports = dictionary;

module.exports.trie = trie;

module.exports.verify = function(word) {
  word = word.toUpperCase();
  var t = trie;
  for (var i = 0, l = word.length; i < l; ++i)
    if (!(t = t[word[i]]))
      return false;
  return !!t._;
};

module.exports.random = function(count) {
  if (count === undefined)
    return dictionary[dictionary.length*Math.random()|0];
  if (!count)
    return [];
  var copy = dictionary.slice(), index = dictionary.length, stop = index - count, swap, temp;
  while (index > stop && --index) {
    swap = (index + 1)*Math.random()|0;
    temp = copy[index];
    copy[index] = copy[swap];
    copy[swap] = temp;
  }
  return copy.slice(-count);
};

// Make REST call to Scrabble.com for this?
module.exports.define = function(word, cb) {
  setImmediate(cb, null, word);
};

// Get a list of similarly spelled words
module.exports.suggest = function(word, tolerance) {
  tolerance = tolerance === undefined ? 4 : tolerance;
  return word;
};
