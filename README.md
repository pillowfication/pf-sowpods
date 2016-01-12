# pf-sowpods

**Scrabble's SOWPODS dictionary** - The SOWPODS dictionary with related functionality.

## Examples

```javascript
// Require the module to use it
var sowpods = require('pf-sowpods');
sowpods[62];    // 'ABAPICAL'
sowpods.length; // 267751

// A trie structure is included, too
sowpods.trie.H.A.P.H.T.A.R.A._; // true
JSON.stringify(sowpods.trie.D.E.R.M.I, null, 2)
// {
//   "C": {
//     "_": true
//   },
//   "S": {
//     "_": true,
//     "E": {
//       "S": {
//         "_": true
//       }
//     }
//   }
// }

// Verify words
sowpods.verify('banana'); // true
sowpods.verify('foobar'); // false

// Define words / get related word forms
sowpods.define('set');
// {TODO}

// Suggest words
sowpods.suggest('puth');
// {TODO}

// Find anagrams out of letters
sowpods.anagram('EYBTOR*'); // [ 'BOOTERY', 'BARYTE', ..., 'YU', 'ZO' ]
// Get all 2-letter words
sowpods.anagram('**')       // [ 'AA', 'AB', ..., 'ZA', 'ZO' ]

// Get random words
sowpods.random();  // 'PICANINNIES'
sowpods.random(2); // ['REFRESHENS', 'EPILOGUIZING']

// Get all 5-letter words
sowpods.filter(function(word) {
  return word.length === 5;
});

// Get all words with 'Q'
sowpods.filter(function(word) {
  return word.indexOf('Q') !== -1;
});
```

## API

### sowpods (Array)

An alphabetized array of the SOWPODS dictionary. All letters are capitalized.

### sowpods.trie (Object)

A trie structure of the words where the nodes are single capitalized characters. The node `._ === true` indicates an End-of-word. Lodash's `get()` function may be useful here

```javascript
var _ = require('lodash');
var subTrie = _.get(sowpods.trie, 'A.B.C.D', {});
```

### sowpods.verify(word)

 * **word** (String) - A word to check (case-insensitive)
 * **returns** (Boolean) - `true` if the word is in SOWPODS

This function crawls the trie to determine if the word exists.

### sowpods.anagram(str)

 * **str** (String) - The letters to anagram (case-insensitive)
 * **returns** (Array) - All possible single word anagrams

`str` may contain `*` or `?` which both indicate a wildcard.

This function recursively permutes the string while crawling the trie to determine if the current permutation is valid or is a word. Please note that using many wildcards will heavily slow down the algorithm.

### sowpods.random(count)

 * **count** (Number) - *Optional*. The number of random words to return
 * **returns** (String, Array) - Some random words

If `count` is undefined, it returns a single string. Otherwise it returns an array of length `count` of random strings.
