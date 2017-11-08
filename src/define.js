// TODO: This file doesn't work

const request = require('superagent')
const cheerio = require('cheerio')

module.exports = function define (word, callback) {
  if (typeof word !== 'string' || !/^[a-z]+$/i.test(word)) {
    return setImmediate(callback, new Error(`\`word\` (${word}) must be an alphabetic string`))
  }

  // request
  // request({
  //   method: 'POST',
  //   url: 'http://scrabble.hasbro.com/en-us/tools#dictionary',
  //   form: { dictWord: word.toLowerCase() }
  // }, (error, response, body) => {
  //   // Shows up as POST
  //   console.log(response.req._header)
  // })

  // superagent
  request
    .post('http://scrabble.hasbro.com/en-us/tools')
    .type('form')
    .send({ dictWord: word.toLowerCase() })
    .end(function (error, response) {
      // Shows up as GET
      console.log(response.req._header)

      if (error) {
        return callback(error)
      }

      const $ = cheerio.load(response.text)
      const element = $('.word-definition').html()

      // This should never happen :(
      // It means that we POSTed incorrectly
      if (!element) {
        return callback(new Error('Request did not go through'))
      }

      // If not a valid Scrabble word, "OOPS!" is returned
      if (/oops!/i.test(element)) {
        return callback(new Error(`\`${word.toLowerCase()}\` not found`))
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
