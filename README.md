# pf-sowpods

**Scrabble's SOWPODS dictionary** - The SOWPODS dictionary with related functionality.

## Examples

```javascript
// Require the module
var sowpods = require('pf-sowpods');

sowpods[62];    // -> 'ABAPICAL'
sowpods.length; // -> 267751

// A trie structure is included, too
sowpods.trie.H.A.P.H.T.A.R.A._; // -> true

// Verify words
sowpods.verify('banana'); // -> true
sowpods.verify('foobar'); // -> false

// Define words / get related word forms
sowpods.define('moo', function(err, data) {
  console.log(data);
});
// {
//   word: 'MOO',
//   definition: 'to make the deep, moaning sound of a cow',
//   related: [ 'MOOED', 'MOOING', 'MOOS' ]
// }

// Find anagrams out of letters
sowpods.anagram('EYBTOR*');
// -> [ 'BOOTERY', 'BARYTE', ..., 'YU', 'ZO' ]
```

## API

### `sowpods`

*({Array})*: An alphabetized array of the SOWPODS dictionary. All letters are capitalized.

```javascript
var _ = require('lodash');
_.filter(sowpods, {length: 5});
// -> [ 'AAHED', 'AALII', ..., 'ZYMES', 'ZYMIC' ]
```

### `sowpods.trie`

*({Object})*: A trie structure of the words where the nodes are single capitalized characters. The node `._ === true` indicates an End-of-word. Lodash's `get()` function may be useful here.

```javascript
var _ = require('lodash');
_.get(sowpods.trie, 'A.B.C.D', {});
// -> {}
_.get(sowpods.trie, 'DERMI'.split());
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
sowpods.verify('foobar'); // -> false
```

### `sowpods.anagram(str)`

**Arguments**
 1. `str` *(String)*: The letters to anagram (case-insensitive).

**Returns**
 * *(Array)*: All possible single word anagrams.

Characters in `str` which are not alphabetic, are considered to be wildcards. This function crawls the trie as long as the next node is available in the letters provided.

```javascript
sowpods.anagram('EYBTOR*');
// -> [ 'BOOTERY', 'BARYTE', ..., 'YU', 'ZO' ]
```

### `sowpods.random([count])`

**Arguments**
 1. `[count]` *(number)*: The number of random words to return.

**Returns**
 * *(String|Array)*: Some random words.

If `count` is undefined, it returns a single string. Otherwise it returns an
array of length `count` of random strings.

```javascript
sowpods.random();  // -> 'PICANINNIES'
sowpods.random(2); // -> [ 'REFRESHENS', 'EPILOGUIZING' ]
```

### `sowpods.define(search, callback)`

**Arguments**
 1. `search` *(String)*: The word to lookup.
 2. `callback` *(Function)*: Callback function with signature `(err, data)`.

`data` is an Object with shape keys `word`, `definition`, and `related`.

```javascript
sowpods.define('moo', function(err, data) {
  console.log(data);
});
// {
//   word: 'MOO',
//   definition: 'to make the deep, moaning sound of a cow',
//   related: [ 'MOOED', 'MOOING', 'MOOS' ]
// }
```
