const request = require('superagent')
const cheerio = require('cheerio')

module.exports = function define (word, callback) {
  if (!/^[a-z]+$/i.test(word)) {
    return setImmediate(callback, new Error(`\`${word}\` must be an alphabetic string`))
  }

  request
    .post('http://scrabble.hasbro.com/en-us/tools#dictionary')
    .type('form')
    .send({ dictWord: word.toLowerCase() })
    .end(function (error, response) {
      if (error) {
        return setImmediate(callback, error)
      }

      const $ = cheerio.load(response.text)
      const element = $('.word-definition').html()

      // If not a valid Scrabble word, OOPS! is returned
      if (!element || /oops!/i.test(element)) {
        console.log(response.text)
        return setImmediate(callback, `\`${word.toLowerCase()}\` not found`)
      }

      const condensed = element.replace(/[\t\n]+/g, '')

      // Example html:
      // "<h4>MOO</h4>to make the deep, moaning sound of a cow<p>Related Words: <strong>MOOED/MOOING/MOOS</strong></p>"
      const _word = condensed.match(/<h4>(.*?)<\/h4>/)
      const definition = condensed.match(/<\/h4>(.*?)<p>/)
      const related = condensed.match(/<strong>(.*?)<\/strong>/)

      setImmediate(callback, null, {
        word: _word && _word[1].trim(),
        definition: definition && definition[1].trim(),
        related: related && related[1].split('/').map(x => x.trim()).filter(x => x)
      })
    })
}
