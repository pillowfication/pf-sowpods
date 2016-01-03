# pf-sowpods

**Scrabble's SOWPODS dictionary** - The SOWPODS dictionary with related functionality.

## Examples

```javascript
// Require the module to use it.
var sowpods = require('pf-sowpods');
sowpods[62]; // 'ABAPICAL'
sowpods.length; // 267751

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
sowpods.anagram('EYBTOR*');
// {TODO}
// Get all 2-letter words
sowpods.anagram('**')
// {TODO}

// Get random words
sowpods.random(); // 'PICANINNIES'
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

### sowpods.verify(word)

 * **word** (String) - A word to check (case-insensitive)
 * **returns** (Boolean) - `true` if the word is in SOWPODS

This function performs a binary search to test if the word exists in the array.
Note: `Math.log(sowpods.length, 2) == 12.497816457936626`

### sowpods.random(count)

 * **count** (Number) - *Optional*. The number of random words to return
 * **returns** (String, Array) - Some random words

If `count` is undefined, it returns a single string. Otherwise it returns an array of length `count` of random strings.
