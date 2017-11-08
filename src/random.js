const dictionary = require('./dictionary')

module.exports = function random (count) {
  if (count === undefined || typeof count !== 'number') {
    const index = Math.random() * dictionary.length | 0
    return dictionary[index]
  }

  const indices = []
  for (let i = 0, l = dictionary.length; i < l; ++i) {
    indices[i] = i
  }

  // Fisher-Yates on just indices, stopping early
  count = Math.min(count, indices.length)
  for (let i = 0; i < count; ++i) {
    const index = Math.random() * (indices.length - i) | 0
    const swap = i + index
    ;[ indices[i], indices[swap] ] = [ indices[swap], indices[i] ]
  }

  // Map the first `count` indices to corresponding words
  const results = []
  for (let i = 0; i < count; ++i) {
    results[i] = dictionary[indices[i]]
  }
  return results
}
