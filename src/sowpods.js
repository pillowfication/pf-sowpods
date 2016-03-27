'use strict';

var _ = require('lodash');
var request = require('superagent');
var cheerio = require('cheerio');
var dictionary = require('./dictionary');

var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var eow = '_';

// Create a trie out of dictionary
var trie = {};
dictionary.forEach(function(word) {
  _.set(trie, (word + eow).split(''), true);
});

module.exports = dictionary;
module.exports.trie = trie;

module.exports.verify = function(word) {
  return _.get(trie, (word.toUpperCase() + eow).split(''), false);
};

module.exports.anagram = function(str) {
  var results = [];
  var bank = str.toUpperCase().split('');
  var wildcards = _.remove(bank, function(letter) {
    return !_.includes(alphabet, letter);
  }).length;

  (function check(results, bank, wildcards, trie, path) {
    Object.keys(trie).forEach(function(node) {
      if (node === eow)
        results.splice(_.sortedIndex(results, path), 0, path);
      else {
        var index = bank.indexOf(node);
        if (index !== -1) {
          var _bank = bank.slice();
          _bank.splice(index, 1);
          check(results, _bank, wildcards, trie[node], path + node);
        } else if (wildcards) {
          check(results, bank, wildcards-1, trie[node], path + node);
        }
      }
    });
  })(results, bank, wildcards, trie, '');

  return results;
},

module.exports.random = function(count) {
  if (count === undefined)
    return dictionary[_.random(0, dictionary.length - 1)];

  return count > 0 ? _.shuffle(dictionary).slice(count) : [];
};

module.exports.define = function(search, callback) {
  if (!/^[a-zA-Z]+$/.test(search))
    return setImmediate(callback, '`' + search + '` must be an alphabetic string');

  request
    .post('http://scrabble.hasbro.com/en-us/tools#dictionary')
    .type('application/x-www-form-urlencoded')
    .send('dictWord=' + search.toLowerCase())
    .end(function(err, res) {
      if (err)
        return callback(err);

      var html = cheerio.load(res.text)('.word-definition').html();

      // If not a valid Scrabble word, OOPS! is returned
      if (!html || /oops/i.test(html))
        return callback('`' + search.toLowerCase() + '` not found');

      html = html.replace(/(\t|\n)+/g, '');

      // Example html:
      // "<h4>MOO</h4>to make the deep, moaning sound of a cow<p>Related Words: <strong>MOOED/MOOING/MOOS</strong></p>"
      var word = html.match(/<h4>(.*?)<\/h4>/),
          definition = html.match(/<\/h4>(.*?)<p>/),
          related = html.match(/<strong>(.*?)<\/strong>/);

      callback(null, {
        word: word && word[1].trim(),
        definition: definition && definition[1].trim(),
        related: related && related[1].split('/').map(_.partial(_.trim, _))
      });
    });
};

// Get a list of similarly spelled words
module.exports.suggest = function(word, tolerance) {
  tolerance = tolerance === undefined ? 4 : tolerance;
  return word;
};
