'use strict';

var dictionary = require('./dictionary');
var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

module.exports.anagram = function(str) {
  str = str.toUpperCase();
  var l = str.length;
  function check(index, trie, node, input, seq) {
    var i, result = [];
    // Avoid retracing
    if (seq.indexOf(index) !== -1)
      return [];
    // Handle wildcards
    if (node === '*' || node === '?') {
      for (i = 0; i < 26; ++i)
        result = result.concat(check(index, trie, alphabet[i], input, seq));
      return result;
    }
    // Crawl the trie
    if (!(trie = trie[node]))
      return [];
    // Check if valid word
    input += node;
    seq = seq.slice();
    seq.push(index);
    if (trie._)
      result.push(input);
    // Recursively anagram
    for (i = 0; i < l; ++i)
      result = result.concat(check(i, trie, str[i], input, seq));
    return result;
  }

  var result = [], i, p;
  for (i = 0; i < l; ++i)
    result = result.concat(check(i, trie, str[i], '', []));
  // Sort and dedupe Array
  result.sort(function(a, b) {
    return b.length - a.length || a.localeCompare(b);
  });
  for (i = result.length-1, p = ''; i >= 0; --i)
    if (result[i] === p)
      result.splice(i, 1);
    else
      p = result[i];
  return result;
},

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
