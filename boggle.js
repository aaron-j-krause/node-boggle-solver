var readline = require('readline');
var fs = require('fs');
var Trie = require('./trie.js');
var _ = require('lodash');
//creates trie from wordlist
var text = fs.readFileSync('wordlist.txt', 'utf8').replace(/\r/g, '').split('\n');
var trie = new Trie(text);
var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

//game
function makeBoard(size){
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var board = [];
  var row;

  for (var i = 0; i < size; i++) {
    row = [];
    for (var j = 0; j < size; j++) {
      row[j] = alpha[Math.floor(Math.random() * 26)];
    }
    console.log(row.join(' '));
    board.push(row);
  }

    return board;
};

function boggle() {
  var board = makeBoard(4);

  rl.question('What next? (n = new board, q = quit, s = solve)', function(answer) {
    if (answer == 'n') {
      boggle();
    }
    else if (answer == 's') {
      console.log(solve(board));
      rl.close();
    } else {
      rl.close();
      console.log('thanks for playing');
    }
  });
}

function startQueue(text) {
  var letter, x, y,
      queue = [];
  for (x = 0; x < text.length; x++) {
    for (y = 0; y < text[x].length; y++) {
      //current letter object
      letter = {
          prefix: text[x][y],
          location: [x, y],
          locations: {}
        };
      letter.locations[letter.location] = letter.location;
      queue.push(letter);
    }
  }
  return queue;
}


function findWords(board) {
    var wordsFound = [];
    var workQueue = [];
    var modArray = [[1, 0], [0, 1], [-1, 0], [0, -1],
      [-1, -1], [1, -1], [-1, 1], [1, 1]];
    var x;
    var y;
    var lastLocation;
    var currentPre;
    var newPre;
    var unseenLocation;

    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        newPre = {
          prefix: board[i][j],
          lastLocation: [i, j],
          locations:{}
        };
        newPre.locations[i] = {};
        newPre.locations[i][j] = true;
        workQueue.push(newPre);
      };
    };

  while (workQueue.length) {
    current = workQueue.shift();
    currentPre = current.prefix;

    if (currentPre.length > 2 && trie.isWord(currentPre)) {
      wordsFound.push(currentPre);
    }

    //loops through letters in all directions if current is prefix
    for (i = 0; i < modArray.length; i++) {
      x = current.lastLocation[0] + modArray[i][0];
      y = current.lastLocation[1] + modArray[i][1];
      unseenLocation = !(current.locations[x] && current.locations[x][y]);
      //console.log('UNSEEN?', unseenLocation)
      if (board[x] && board[x][y] && unseenLocation && trie.isPrefix(currentPre + board[x][y])) {
        //creates new object for letter plus neighbor

        newPre = {
          prefix: currentPre + board[x][y],
          lastLocation: [x, y],
          locations: _.clone(current.locations)
        };
        if (!newPre.locations[x]) newPre.locations[x] = {};
        newPre.locations[x][y] = true;
        workQueue.push(newPre);
      }
    }
  }
  return wordsFound;
}

//lists all unique words found in board
function solve(board) {
  var wordsFound = findWords(board);
  return _.uniq(wordsFound);
}

boggle();
