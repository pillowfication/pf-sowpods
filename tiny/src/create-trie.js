/*
 * The technique used here is described in https://github.com/fogleman/TWL06
 *   M: More Flag
 *   L: Letter (ASCII Uppercase) OR 0 for EOW
 *   I: Pointer OR Word Index for EOW
 *
 * If a block contains a EOW entry, that entry will appear first in the block.
 */

const fs = require('fs')
const path = require('path')
const dictionary = require('../../src/dictionary')
const baseTrie = require('../../src/trie')

const trie = []
let wordIndex = 0

;(function addNode (node) {
  const letters = Object.keys(node).filter(letter => letter !== '_')

  if (node._ === true) {
    trie.push({
      M: letters.length > 0,
      L: '_',
      I: wordIndex++
    })
  }

  const startLetterIndex = trie.length
  letters.forEach((letter, letterIndex) => {
    trie.push({
      M: letterIndex !== letters.length - 1,
      L: letter,
      I: null
    })
  })

  letters.forEach((letter, letterIndex) => {
    trie[startLetterIndex + letterIndex].I = trie.length
    addNode(node[letter])
  })
})(baseTrie)

const u32trie = new Uint32Array(trie.length + 1)
u32trie[0] = dictionary.length

for (let index = 0; index < trie.length; ++index) {
  const entry = trie[index]
  let value = 0

  if (entry.M) {
    value |= 1 << 31
  }
  if (entry.L !== '_') {
    value |= entry.L.charCodeAt(0) << 24
  }
  value |= entry.I

  u32trie[index + 1] = value
}

fs.writeFileSync(path.resolve(__dirname, './trie'), Buffer.from(u32trie.buffer))
