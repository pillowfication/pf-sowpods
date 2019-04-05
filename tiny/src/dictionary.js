const fs = require('fs')
const path = require('path')

const trie = fs.readFileSync(path.resolve(__dirname, './trie'))
console.log(trie)
console.log(new Uint32Array(trie))
const length = trie[0]

const dictionary = new Proxy({}, {
  get (_, prop) {
    if (prop === 'length') {
      return length
    }

    const index = prop >>> 0
    if ('' + index !== prop || index >= length) {
      return undefined
    }


  }
})

module.exports = dictionary
