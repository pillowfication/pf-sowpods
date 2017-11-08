const sowpods = require('./src/sowpods')
module.exports = sowpods

// Extra features
sowpods.anagram = require('./src/anagram')
sowpods.suggest = require('./src/suggest')
