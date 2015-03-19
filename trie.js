//takes wordlist as array
var Trie = function(wordlist) {
  var dict = (function (wordlist) {
    var i,
        d = {};
    for (i in wordlist) {
      d[wordlist[i]] = true;
    }
    return d;
  })(wordlist),
  trie = (function(wordlist) {
    var currentLeaf, currentWord, currentLetter, i, j,
    t = {};
    for (i = 0, length = wordlist.length; i < length; i++) {
      currentWord = wordlist[i];
      currentLeaf = t;
      for (j = 0, len = wordlist[i].length; j < len; j++) {
        currentLetter = currentWord.charAt(j);
        if (!(currentLetter in currentLeaf)) {
          currentLeaf[currentLetter] = {};
        }
        currentLeaf = currentLeaf[currentLetter];
      }
    }
    return t;
  })(wordlist);

  return {
    isPrefix: function(string) {
      var currentLetter, i,
          currentLeaf = trie;
      for (i = 0; i < string.length; i++) {
        currentLetter = string[i];
        if (!(currentLetter in currentLeaf)) {
          return false;
        }
        currentLeaf = currentLeaf[currentLetter];
      }
      return true;
    },

    isWord: function(string) {
      return (string in dict);
    }
  };
};

module.exports = Trie;
