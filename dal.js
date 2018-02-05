const fs = require("fs");
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

function checkForWin(wordArray, hiddenArray) {
  let winner = true;
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] !== hiddenArray[i]) {
      winner = false;
    }
  }
  return winner;
}

function createWordArray(word) {
  let wordArray = [];
  for (let i = 0; i < word.length; i++) {
    wordArray[i] = word.slice(i, i+1);
  }
  return wordArray;
}

function createHiddenArray(word) {
  let hiddenArray = [];
  for (let i = 0; i < word.length; i++) {
    hiddenArray[i] = "_";
  }
  return hiddenArray;
}

function createHiddenWord(wordArray) {
  let hiddenWord = "";
  for (let i = 0; i < wordArray.length; i++) {
    hiddenWord += wordArray[i] + " ";
  }
  return hiddenWord;
}

function playaPlayaSetup(player) {
    let min;
    let max;
  if (player.level === "easy") {
    min = 2;
    max = 4;
  } else if (player.level === "normal") {
    min = 4;
    max = 8;
  } else {
    min = 6;
    max = 19;
  }
  let x = Math.floor(Math.random()*words.length);
  let word = words[x];
  while (word.length < min || word.length > max) {
    x = Math.floor(Math.random()*words.length);
    word = words[x];
  }
  let wordArray = createWordArray(word);
  let hiddenArray = createHiddenArray(word);
  let hiddenWord = createHiddenWord(hiddenArray);
  player.word = word;
  player.hiddenWord = hiddenWord;
  player.wordArray = wordArray;
  player.hiddenArray = hiddenArray;

  console.log(word)

  return player;
}

function testLetterInput(letter) {
  return (letter.length > 1 || letter < "a" || letter > "z");
}

function testForRepeatedLetter(letter, player) {
  let repeat = false;
  for (let i = 0; i < player.letters.length; i++) {
    if (letter === player.letters[i]) {
      repeat = true;
    }
  }
  return repeat;
}

function testForMatchingLetter(letter, player) {
  let match = false;
  player.letters.push(letter);
  for (let i = 0; i < player.wordArray.length; i++) {
    if (player.wordArray[i] === letter) {
      player.hiddenArray[i] = letter;
      match = true;
    }
  }
  if (!match) {
    player.numGuesses -= 1;
  }
  player.hiddenWord = createHiddenWord(player.hiddenArray);
  return player;
}

module.exports = { 
    checkForWin, 
    createWordArray, 
    createHiddenArray, 
    createHiddenWord, 
    playaPlayaSetup, 
    testLetterInput, 
    testForRepeatedLetter, 
    testForMatchingLetter
}
