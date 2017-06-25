// Game constructor function and methods:

var Game = function() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  console.log('winning num: ' + this.winningNumber);
};

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
  // TODO: this still allows NaN values
  if (num < 1 || num > 100 || typeof num !== 'number')
    throw 'That is an invalid guess.';
  else {
    this.playersGuess = num;
    return this.checkGuess();
  }
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $('#submit, #hint').prop('disabled', true);
    $('#directions').text('Click the Reset button to play again.');
    $('#player-input').prop('placeholder', this.playersGuess);
    return 'The winning number is ' + this.winningNumber + '. YOU WIN!';
  }

  else if (this.pastGuesses.includes(this.playersGuess)) {
    $('#directions').text('You have already guessed that number.');
    return 'Guess again!';
  }

  else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

    if (this.pastGuesses.length < 5) {
      var direction = this.isLower() ? 'Guess higher.' : 'Guess lower.';
      $('#directions').text(direction);

      var diff = this.difference();
      if (diff < 10) return 'You\'re burning up! Less than 10 numbers away.';
      else if (diff < 25) return 'You\'re lukewarm. Less than 25 numbers away.';
      else if (diff < 50) return 'You\'re a bit chilly. Less than 50 numbers away.';
      else return 'You\'re ice cold! Away more than 50 numbers.';
    }
    else {
      $('#submit, #hint').prop('disabled', true);
      $('#directions').text('Click the Reset button to play again.');
      return 'YOU LOSE. The winning number was ' + this.winningNumber + '.';
    }
  }
};

Game.prototype.provideHint = function() {
  var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
  console.log(hintArr);
  return shuffle(hintArr);
}


// other functions:

function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr) {
  var m = arr.length,
      t,
      i;

  while(m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

function newGame() {
  return new Game();
}

// jQuery additions

$(document).ready(function() {
  // load new game
  var guessingGame = newGame();

  $('#submit').click(function() {
    submitGuess(guessingGame);
  });

  $(document).keypress(function(e) {
    if (e.which == 13 && !$('#submit').prop('disabled')) {
      submitGuess(guessingGame);
    }
  });

  $('#reset').click(function() {
    $('#submit, #hint').prop('disabled', false);
    $('#title').text('Play the Guessing Game');
    $('#subtitle').text('Guess a number from 1 to 100!');
    $('#directions').text('You get to have 1 hint.');
    $('#player-input').prop('placeholder', '#');
    $('.guess').text('-');
    guessingGame = newGame();
  });

  $('#hint').click(function() {
    var hint = guessingGame.provideHint();
    $('#directions').text('Remember these! The winning number is ' + hint[0] + ', ' + hint[1] + ', or ' + hint[2] + '.');
    $('#hint').prop('disabled', true);
  });
});

function submitGuess(game) {
  game.playersGuess = $('#player-input').val();
  $('#player-input').val('');
  var guessResult = game.playersGuessSubmission(parseInt(game.playersGuess, 10));
  $('#subtitle').text(guessResult);
}