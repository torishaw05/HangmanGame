const express = require('express');
const fs = require('fs');
const router = express.Router();
let words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

let random_word = words[Math.floor(Math.random() * words.length)];
let letter_guess  = [];
let underscore    = [];
let objects       = {};
let guess_amt     = 8;
let word_guess    = random_word.split('');
let new_random    = '';

word_guess.forEach(function () {
  underscore.push('_');
});
function started() {
  random_word= words[Math.floor(Math.random() * words.length)];
  letter_guess = [];
  underscore = [];
  object= {};
  guess_amt = 8;
  word_guess = random_word.split('');
  new_random= '';

  word_guess.forEach(function () {
    underscore.push('_');
  });
};

router.get('/', function(req, res) {
  objects = {
    word: underscore,
    attempts: guess_amt,
    letter_guess: letter_guess
  }
  res.render('words', {objects: objects});
});

router.post('/', function(req, res) {
  let new_letter = req.body.letter;
  req.checkBody('letter', 'Please insert one letter at a time!').isLength({max:1});
  req.checkBody('letter', 'Your guss can only include letters!').isAlpha();

let errors = req.getValidationResult();
let messages = [];
errors.then(function(allErrors){
  allErrors.array().forEach(function(error){
    messages.push(error.msg);
  });
})
let match = false;

for(var i = 0; i < word_guess.length; i++) {
  if (new_letter === word_guess[i] ) {
    match = true
    guess_amt == guess_amt
    underscore[i] = word_guess[i];
  }
}
if(word_guess.indexOf(new_letter) ===-1) {
  letter_guess.push(new_letter);

}
if (new_letter == letter_guess) {
  guess_amt == guess_amt
}

if (underscore.toString() === word_guess.toString()){
  res.redirect('/win');
  req.session.destroy();
  started();
}


if(!match) {
  guess_amt --;
}

if (guess_amt == 0) {
  res.redirect('lose');
  req.session.destroy();
  started();
}

objects = {
  word: underscore,
  attempts: guess_amt,
  leter: new_letter,
  letter_guess : letter_guess,
  error: messages
}

res.redirect('/');

});

router.get('/lose', function(req, res) {
  res.render('lose', {random_word});
});
router.post('/lose', function(req, res) {
  req.session.destroy();
  started();
  res.redirect('/');
});
router.get('/win', function(req, res) {
  res.render('win');
});
router.post('/win', function(req, res) {
  req.session.destroy();
  started();
  res.redirect('/');
});

module.exports = router;
