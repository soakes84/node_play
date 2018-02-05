const express = require("express");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");
const parseurl = require("parseurl");
const expressValidator = require("express-validator");

const app = express();
const daDal = require("./dal");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static("public"));

app.use(session({
  secret: "paco",
  resave: false,
  saveUninitialized: true
}));

app.get("/", function(req, res) {
  res.redirect("/home");
});

app.get("/home", function(req, res) {
  res.render("home");
});

app.post("/home", function(req, res) {
  let player = {name: req.body.name, level: req.body.level, numGuesses: 8, letters: [], end: false};
  player = daDal.playaPlayaSetup(player);
  req.session.player = player;
  res.redirect("/game");
});

app.get("/game", function(req, res) {
  res.render("game", {player: req.session.player});
});

app.post("/game", function(req, res) {
  let letter = req.body.letter;
  let player = req.session.player;
  if (daDal.testLetterInput(letter)) {
    res.render("game", {player: player, message: "Enter only ONE letter please."});
  } else if (daDal.testForRepeatedLetter(letter, player)) {
        res.render("game", {player: player, message: "You have already guessed the letter: " + letter + ", try again."});
  } else {
    player = daDal.testForMatchingLetter(letter, player);
    if (daDal.checkForWin(player.wordArray, player.hiddenArray)) {
      player.end = true;
      res.redirect("/winner");
    } else if (player.numGuesses === 0) {
      player.end = true;
      res.redirect("/loser");
    }
    res.redirect("/game");
  }
});

app.get("/winner", function(req, res) {
  res.render("winner", {player: req.session.player});
});

app.get("/loser", function(req, res) {
  res.render("loser", {player: req.session.player});
});

app.post("/winner", function(req, res) {
  req.session.destroy();
  res.redirect("/home");
});

app.post("/loser", function(req, res) {
  req.session.destroy();
  res.redirect("home");
});

app.listen(3000, function () {
  console.log("Game is running on 3000");
});