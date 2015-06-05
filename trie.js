//takes wordlist as array
var Trie = function(wordlist) {
  this.wordlist = (function (wordlist) {
    var dict = {};

    for (var i = 0; i < wordlist.length; i++) {
      dict[wordlist[i]] = true;
    }

    return dict;
  })(wordlist);

  this.tree = (function(wordlist) {
    var currentLeaf;
    var currentWord;
    var currentLetter;
    var trie = {};

    for (var i = 0; i < wordlist.length; i++) {
      currentWord = wordlist[i];
      currentLeaf = trie;

      for (var j = 0; j < currentWord.length; j++) {
        currentLetter = currentWord.charAt(j);
        if (!currentLeaf[currentLetter]) {
          currentLeaf[currentLetter] = {};
        }

        currentLeaf = currentLeaf[currentLetter];
      }
    }

    return trie;
  })(wordlist);

};

Trie.prototype.isPrefix = function(string) {
  var currentLeaf = this.tree;
  var currentLetter;

  for (i = 0; i < string.length; i++) {
    currentLetter = string[i];
    if (!currentLeaf[currentLetter]) return false;

    currentLeaf = currentLeaf[currentLetter];
  }

  return true;
};

Trie.prototype.isWord = function(string) {
  return !!(this.wordlist[string])
};

module.exports = Trie;
