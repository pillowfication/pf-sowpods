const _ = require('lodash');
const request = require('superagent');
const cheerio = require('cheerio');

module.exports = function define(search, callback) {
  if (!/^[a-zA-Z]+$/.test(search))
    return setImmediate(callback, `\`${search}\` must be an alphabetic string`);

  request
    .post('http://scrabble.hasbro.com/en-us/tools#dictionary')
    .type('application/x-www-form-urlencoded')
    .send('dictWord=' + search.toLowerCase())
    .end(function(err, res) {
      if (err)
        return setImmediate(callback, err);

      let html = cheerio.load(res.text)('.word-definition').html();

      // If not a valid Scrabble word, OOPS! is returned
      if (!html || /oops!/i.test(html))
        return setImmediate(callback, `\`${search.toLowerCase()}\` not found`);

      html = html.replace(/(\t|\n)+/g, '');

      // Example html:
      // "<h4>MOO</h4>to make the deep, moaning sound of a cow<p>Related Words: <strong>MOOED/MOOING/MOOS</strong></p>"
      let word = html.match(/<h4>(.*?)<\/h4>/)
        , definition = html.match(/<\/h4>(.*?)<p>/)
        , related = html.match(/<strong>(.*?)<\/strong>/);

      setImmediate(callback, null, {
        word: word && word[1].trim(),
        definition: definition && definition[1].trim(),
        related: related && _.filter(related[1].split('/').map(_.partial(_.trim, _)))
      });
    });
};
