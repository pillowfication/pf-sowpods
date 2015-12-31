'use strict';

var fs = require('fs');

var dictionary = fs.readFileSync(__dirname+'/sowpods.txt').toString().split('\n');
var undefined;

module.exports = dictionary;

module.exports.verify = function(word) {
  word = word.toUpperCase();
  var min = 0, max = dictionary.length-1, mid;
  while (min <= max) {
    mid = min + max >> 1;
    switch (word.localeCompare(dictionary[mid])) {
      case -1: max = mid - 1; break;
      case  1: min = mid + 1; break;
      case  0: return true;
    }
  }
  return false;
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
