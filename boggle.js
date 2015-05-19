var readline = require('readline'),
    fs = require('fs'),
    Trie = require('./trie.js'),
    _ = require('lodash'),
    //creates trie from wordlist
    text = fs.readFileSync('wordlist.txt', 'utf8'),
    text = text.replace(/\r/g, '').split('\n'),
    trie = new Trie(text),
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
//game
function makeBoard(size){
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      area = size * size,
      board = [],
      row = [],
      rand;

  for (var i = 0; i < area; i++) {
    rand = Math.floor(Math.random() * alpha.length);
    row.push(alpha[rand]);
    if (size % (i + 1) === 0)
      console.log(row.join(' '));
      board.push(row);
      row = [];
  };

    return board;
};

function boggle() {
  var i, j, row,
      alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      board = [];
  for (i = 0; i < 4; i++) {
    row = [];
    for (j = 0; j < 4; j++) {
      row[j] = alpha[Math.floor(Math.random() * 26)];
    }
    console.log(row.join(' '));
    board.push(row);
  }

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


function findWords(queue, board) {
  var current, currentX, currentY, currentPre, modX, modY, next, i, r,
      wordsFound = [],
      workQueue = queue,
      modArray = [[1, 0], [0, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
  while (workQueue.length) {
    current = workQueue.shift();
    currentX = current.location[0];
    currentY = current.location[1];
    currentPre = current.prefix;
    if (trie.isWord(currentPre) && currentPre.length > 2) {
      wordsFound.push(currentPre);
    }
    //loops through letters in all directions if current is prefix
    if (trie.isPrefix(currentPre)) {
      for (i = 0; i < modArray.length; i++) {
        modX = modArray[i][0];
        modY = modArray[i][1];
        if (board[currentX + modX] && board[currentX + modX][currentY + modY] &&
            !([currentX + modX, currentY + modY] in current.locations)) {
          //creates new object for letter plus neighbor
          next = {
            prefix: currentPre + board[currentX + modX][currentY + modY],
            location: [currentX + modX, currentY + modY],
            locations: {}
          };
          next.locations = _.clone(current.locations);
          next.locations[next.location] = next.location;
          workQueue.push(next);
        }
      }
    }
  }
  return wordsFound;
}

//lists all unique words found in board
function solve(board) {
  var workQueue = startQueue(board),
      wordsFound = findWords(workQueue, board);
  return _.uniq(wordsFound);
}

boggle();
