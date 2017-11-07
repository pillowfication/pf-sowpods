const sowpods = require('./src/sowpods')
module.exports = sowpods

// Extra features
sowpods.anagram = require('./src/anagram')
// sowpods.define = require('./src/define')
sowpods.suggest = require('./src/suggest')

// Temporary placeholder
sowpods.define = function define (word, callback) {
  return setImmediate(callback, new Error('`define` not implemented'))
}
