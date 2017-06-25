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
    $('#subtitle').text('Click the Reset button to play again.');
    $('#player-input').prop('placeholder', this.playersGuess);
    return 'You Win!';
  }

  else if (this.pastGuesses.includes(this.playersGuess)) {
    $('#subtitle').text('You have already guessed that number.');
    return 'Guess again!';
  }

  else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

    if (this.pastGuesses.length < 5) {
      var direction = this.isLower() ? 'Guess higher.' : 'Guess lower.';
      $('#subtitle').text(direction);

      var diff = this.difference();
      if (diff < 10) return 'You\'re burning up!';
      else if (diff < 25) return 'You\'re lukewarm.';
      else if (diff < 50) return 'You\'re a bit chilly.';
      else return 'You\'re ice cold!';
    }
    else {
      $('#submit, #hint').prop('disabled', true);
      $('#subtitle').text('Click the Reset button to play again.');
      return 'You Lose.';
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
    $('#subtitle').text('Guess a number between 1-100!');
    $('#player-input').prop('placeholder', '#');
    $('.guess').text('-');
    guessingGame = newGame();
  });

  $('#hint').click(function() {
    var hint = guessingGame.provideHint();
    $('#title').text(hint);
    $('#hint').prop('disabled', true);
  });
});

function submitGuess(game) {
  game.playersGuess = $('#player-input').val();
  $('#player-input').val('');
  var guessResult = game.playersGuessSubmission(parseInt(game.playersGuess, 10));
  $('#title').text(guessResult);
}