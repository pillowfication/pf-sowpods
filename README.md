# pf-sowpods

**Scrabble's SOWPODS dictionary** - The SOWPODS dictionary with related functionality.

## Examples

```javascript
// Require the module
const sowpods = require('pf-sowpods');

sowpods[62];    // -> 'ABAPICAL'
sowpods.length; // -> 267751

// A trie structure is included, too
sowpods.trie.H.A.P.H.T.A.R.A._; // -> true

// Verify words
sowpods.verify('banana');  // -> true
sowpods.verify('asdfjkl'); // -> false

// Define words / get related word forms
sowpods.define('moo', (err, data) => {
  console.log(data);
});
// { word: 'MOO',
//   definition: 'to make the deep, moaning sound of a cow',
//   related: [ 'MOOED', 'MOOING', 'MOOS' ] }

// Find anagrams out of letters
sowpods.anagram('BCKRTO*');
// -> [ 'AB', 'ABO', 'ABORT', ..., 'YOK', 'YORK', 'ZO' ]

// Get similarly spelled words
sowpods.suggest('pillowy');
// -> [ 'BILLOW', 'BILLOWS', 'MELLOWY', ..., 'WILLOWS', 'WILLOWY', 'YELLOWY' ]
```

## API

You can require the whole module, or just pieces of it.
```javascript
require('pf-sowpods');                // Everything
require('pf-sowpods/src/dictionary'); // Just the array of SOWPODS words
require('pf-sowpods/src/sowpods');    // The dictionary and a few core features
```

### `sowpods`

*({Array})*: An alphabetized array of the SOWPODS dictionary. All letters are capitalized.

```javascript
sowpods.filter((word) => word.length === 5);
// -> [ 'AAHED', 'AALII', ..., 'ZYMES', 'ZYMIC' ]
```

### `sowpods.trie`

*({Object})*: A trie structure of the words where the nodes are single capitalized characters. The node `<path>._ === true` indicates an End-of-Word. Lodash's `_.get()` function may be useful here.

```javascript
const _ = require('lodash');
_.get(sowpods.trie, 'A.B.C.D', {});
// -> {}
_.get(sowpods.trie, 'DERMI'.split(''));
// -> {
//   C: { _: true },
//   S: { _: true,
//     E: { S: { _: true } }
//   }
// }
```

### `sowpods.verify(word)`

**Arguments**
 1. `word` *(String)*: A word to check (case-insensitive).

**Returns**
 * *(Boolean)*: `true` if the word is in SOWPODS, `false` otherwise.

This function crawls the trie to determine if the word exists.

```javascript
sowpods.verify('banana'); // -> true
sowpods.verify('asdfjkl'); // -> false
```

### `sowpods.anagram(chars)`

**Arguments**
 1. `chars` *(String)*: The letters to anagram (case-insensitive).

**Returns**
 * *(Array)*: All possible single word anagrams.

Characters in `chars` which are not alphabetic, are considered to be wildcards. This function crawls the trie as long as the next node is available in the letters provided.

```javascript
sowpods.anagram('EYBTOR*');
// -> [ 'BOOTERY', 'BARYTE', ..., 'YU', 'ZO' ]
```

### `sowpods.random([count])`

**Arguments**
 1. `[count]` *(number)*: The number of random words to return.

**Returns**
 * *(String|Array)*: Some random words.

If `count` is undefined, it returns a single string. Otherwise it returns an array of length `count` of random strings.

```javascript
sowpods.random();  // -> 'PICANINNIES'
sowpods.random(2); // -> [ 'REFRESHENS', 'EPILOGUIZING' ]
```

### `sowpods.define(search, callback)`

**Arguments**
 1. `search` *(String)*: The word to lookup.
 2. `callback` *(Function)*: Callback function with signature `(err, data)`.

`data` is an Object with keys `word`, `definition`, and `related`.

```javascript
sowpods.define('moo', (err, data) => {
  console.log(data);
});
// { word: 'MOO',
//   definition: 'to make the deep, moaning sound of a cow',
//   related: [ 'MOOED', 'MOOING', 'MOOS' ] }
```

This function uses [Scrabble's online dictionary](http://scrabble.hasbro.com/en-us/tools#dictionary). However, many words in SOWPODS are not defined there.

```javascript
sowpods.define('supergrass', (err) => { console.log(err); });
// `supergrass` not found
```

The online dictionary will also defer many definitions to [Merriam-Webster](http://www.merriam-webster.com/).

```javascript
sowpods.define('acetylenic', (err, data) => { console.log(data); });
// { word: 'ACETYLENIC',
//   definition: null,
//   related: null }
```

Finally, some words were not given definitions.

```javascript
sowpods.define('redone', (err, data) => { console.log(data); });
// { word: 'REDONE',
//   definition: '',
//   related: [ 'REDO', 'REDID', 'REDOING', 'REDOES' ] }
```

### `sowpods.suggest(string, [distance = 2])`

**Arguments**
 1. `strings` *(String)*: The string to query (case-insensitive).
 2. `[distance = 2]` *(number)*: The maximum distance to search for.

**Returns**
 * *(Array)*: All SOWPODS words whose [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) from `string` is no more than `distance`.

```javascript
sowpods.suggest('pillowy');
// -> [ 'BILLOW', 'BILLOWS', 'MELLOWY', ..., 'WILLOWS', 'WILLOWY', 'YELLOWY' ]
sowpods.suggest('catfish', 1);
// -> [ 'BATFISH', 'CATFISH', 'CATTISH', 'RATFISH' ]
```
