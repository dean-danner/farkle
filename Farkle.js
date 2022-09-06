var newGame = new Game();

var myGame = document.getElementById("game");
var myMessage = document.getElementById("msg");
var myError = document.getElementById("error");
var myScore = document.getElementById("score");
var myPlayers = document.getElementById("playerNames");
var myHD = document.getElementById("hd");

var buttonSubmit = document.getElementById("submit");
var buttonStart = document.getElementById("start");
var buttonRoll = document.getElementById("roll");
var buttonEnd = document.getElementById("end");
var buttonReset = document.getElementById("reset");

buttonSubmit.addEventListener("click", function() {
  newGame.playerNum = document.getElementById("players").value;
  var inputs = ["2", "3", "4", "5"];

  if (inputs.includes(newGame.playerNum)) {
    setupPlayers();
  } else {
    myError.innerHTML = "Invalid number";
  }
});
buttonStart.addEventListener("click", function() {
  var error = false;
  for (var i = 0; i < newGame.playerNum; i++) {
    if (document.getElementById("p" + (i + 1)).value == "") {
      myError.innerHTML = "Missing names";
      error = true;
      break;
    }
  }
  if (!error) {
    setupGame();
  }
});
buttonRoll.addEventListener("click", function() {
  roll();
  checkMatches(points());
  if (newGame.dice.length == 0) {
    newGame.dice.length = 6;
  }
});
buttonEnd.addEventListener("click", function() {
  if (newGame.rolls == 0) {
    myError.innerHTML = "You have not rolled yet";
  } else if (newGame.hotDice) {
    myError.innerHTML = "You cannot end a turn on hot dice";
  } else {
    myMessage.innerHTML = "";
    placeHolder();
    nextTurn();
    if (newGame.hasWin) {
      reset();
    }
  }
});
buttonReset.addEventListener("click", function() {
  newGame.hasWin = false;
  document.getElementById("reset").className = "off";
  document.getElementById("nummos").className = "num";
  document.getElementById("winner").innerHTML = "";
});

function Game() {
  this.playerNum = 0;
  this.players = [];
  this.dice = [0, 0, 0, 0, 0, 0];
  this.tempScore = 0;
  this.scores = [];
  this.turn = 0;
  this.noMatches = false;
  this.hotDice = false;
  this.farkle = false;
  this.rolls = 0;
  this.rollsHD = 0;
  this.hasWin = false;
  this.scoreUpdate = function() {
    var scores = "<p id=\"uscore\">Scores</p><table>"
    for (var i = 0; i < this.players.length; i++) {
      scores += "<tr><td>" + this.players[i] + "</td><td>" + this.scores[i]
      + "</td></tr>";
      if (this.scores[i] >= 10000) {
        document.getElementById("winner").innerHTML = this.players[i]
        + " WINS!";
        this.hasWin = true;
      }
    }
    return scores + "</table><p class=\"info\">Turn: "
    + this.players[this.turn] + "<br />Points: " + this.tempScore + "</p>";
  }
}

function setupPlayers() {
  myError.innerHTML = "";
  var allNum = document.querySelectorAll(".num");
  for (var i = 0; i < allNum.length; i++) {
    allNum[i].className = "offNum";
  }

  for (var i = 0; i < newGame.playerNum; i++) {
    myPlayers.innerHTML += "<p class=\"names\">Player " + (i + 1) +
      ": <input type=\"text\" id=\"p" + (i + 1) + "\" size=\"10\"" +
      "maxlength=\"10\" /></p>";
    newGame.scores.push(0);
  }
  document.getElementById("start").className = "names";
}

function setupGame() {
  myError.innerHTML = "";
  var allNames = document.querySelectorAll(".names");
  for (var i = 0; i < allNames.length; i++) {
    allNames[i].className = "offNames";
  }

  for (var i = 0; i < newGame.playerNum; i++) {
    newGame.players.push(document.getElementById("p" + (i + 1)).value);
  }

  var allTempOff = document.querySelectorAll(".offGame");
  for (var i = 0; i < allTempOff.length; i++) {
    allTempOff[i].className = "game";
  }
  placeHolder();
  myScore.innerHTML = newGame.scoreUpdate();
}

function roll() {
  for (var i = 0; i < newGame.dice.length; i++) {
    newGame.dice[i] = Math.floor((Math.random() * 6) + 1);
  }

  var img = "<table>";
  for (var i = 0; i < newGame.dice.length; i++) {
    img += "<td id=d" + (i + 1) + " class=\"nhimg\"><img " + "src = 'Die" +
      newGame.dice[i] + ".png'" + "width='50px' /></td>";
  }
  myGame.innerHTML = img + "</table>";
  newGame.rolls++;
  myMessage.innerHTML = "";
  myError.innerHTML = "";
  for (var k = 0; k < newGame.dice.length; k++) {
    document.getElementById("d" + (k + 1)).className = "nhimg";
  }
}

function points() {
  var counts = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < newGame.dice.length; i++) {
    counts[newGame.dice[i] - 1]++;
  }
  return counts;
}

function placeHolder() {
  var img = "<table>";
  for (var i = 0; i < 6; i++) {
    img += "<td class=\"nhimg\"><img src = 'Die1.png' width='50px' /></td>";
  }
  myGame.innerHTML = img + "</table>";
}

function checkMatches(points) {
  var sCount = 0;
  if (!checkStraight(points) && !checkThreeKind(points) &&
    !checkSixPair(points)) {
    for (var i = 0; i < newGame.dice.length; i++) {
      if (newGame.dice[i] == 1 || newGame.dice[i] == 5) {
        document.getElementById("d" + (i + 1)).className = "himg";
      }
    }

    if (checkThreePair(points)) {
      sCount += 3;
    } else {
      if (points[0] == 0 && points[4] == 0) {
        newGame.noMatches = true;
      }
    }

    for (var i = 0; i < points.length; i++) {
      if (points[0] > 0) {
        myMessage.innerHTML += "<p class=\"good\">You rolled a 1!<br />+100" +
          "<br /></p>";
        newGame.tempScore += 100;
        sCount++;
        points[0]--;
      }
      if (points[4] > 0) {
        myMessage.innerHTML += "<p class=\"good\">You rolled a 5!<br />+50" +
          "<br /></p>";
        newGame.tempScore += 50;
        sCount++;
        points[4]--;
      }
    }

    newGame.dice.length -= sCount;
  } else {
    sCount = 6;
    for (var i = 0; i < newGame.dice.length; i++) {
      document.getElementById("d" + (i + 1)).className = "himg";
    }
  }

  if (sCount == 6) {
    newGame.hotDice = true;
  }

  if (newGame.noMatches) {
    if (newGame.dice.length == 6) {
      if (newGame.hotDice) {
        myHD.innerHTML = "";
        myMessage.innerHTML = "<p class=\"bad\">You rolled nothing on hot "
        + "dice<br />and lost all your points!<br />-" + newGame.tempScore
        + "</p>";
        newGame.tempScore = 0;
        nextTurn();
      } else {
        newGame.farkle = true;
      }
    } else {
      myMessage.innerHTML = "<p class=\"bad\">You rolled nothing and<br />" +
        "lost all your points!<br />-" + newGame.tempScore + "</p>";
      newGame.tempScore = 0;
      nextTurn();
    }
  }

  if (newGame.hotDice) {
    for (var k = 0; k < newGame.dice.length; k++) {
      document.getElementById("d" + (k + 1)).className = "himg";
    }
    myHD.innerHTML += "<p class=\"hd\">HOT DICE!</p>";
    newGame.rollsHD++;
    if (newGame.rollsHD > 1 && !newGame.noMatches) {
      newGame.hotDice = false;
      newGame.rollsHD = 0;
      myHD.innerHTML = "";
    }
  }

  if (newGame.farkle) {
    newGame.scores[newGame.turn] -= 1000;
    nextTurn();
    myMessage.innerHTML = "<p class=\"bad\">Farkle!<br />-1000</p>";
  }
  myScore.innerHTML = newGame.scoreUpdate();
}

function checkStraight(points) {
  var straight = true;
  for (var i = 0; i < points.length; i++) {
    if (points[i] != 1) {
      straight = false;
      break;
    }
  }
  if (straight) {
    newGame.tempScore += 3000;
    myMessage.innerHTML = "<p class=\"good\">You rolled a straight!" +
      "<br />+3000</p>";
  }
  return straight;
}

function checkThreeKind(points) {
  var threeKind = false;
  var twoCount = 0;
  for (var i = 0; i < points.length; i++) {
    if (points[i] == 2) {
      twoCount++;
    }
  }
  if (twoCount == 3) {
    threeKind = true;
    newGame.tempScore += 1500;
    myMessage.innerHTML = "<p class=\"good\">You rolled three pairs!" +
      "<br />+1500</p>";
  }
  return threeKind;
}

function checkThreePair(points) {
  var hasPair = false;
  var pairs = 0;

  for (var i = 0; i < points.length; i++) {
    if (points[i] >= 3) {
      hasPair = true;
      pairs++;

      if (i == 0) {
        newGame.tempScore += 1000;
        myMessage.innerHTML += "<p class=\"good\">You rolled three 1's!" +
          "<br />+1000<br /></p>";
        points[0] -= 3;
      } else {
        var add = ((i + 1) * 100)
        newGame.tempScore += add;
        myMessage.innerHTML += "<p class=\"good\">You rolled three " +
          (i + 1) + "'s!<br />+" + add + "<br /></p>";
        points[i] -= 3;
      }

      if (pairs == 1) {
        var hcount = 0;
        for (var j = 0; j < newGame.dice.length; j++) {
          if (hcount < 3 && newGame.dice[j] == (i + 1)) {
            document.getElementById("d" + (j + 1)).className = "himg";
            hcount++;
          }
        }
        hcount = 0;
      } else {
        for (var k = 2; k < newGame.dice.length; k++) {
          document.getElementById("d" + (k + 1)).className = "himg";
        }
        newGame.hotDice = true;
      }
    }
  }
  return hasPair;
}

function checkSixPair(points) {
  var hasPair = false;
  for (var i = 0; i < points.length; i++) {
    if (points[i] == 6) {
      hasPair = true;
      for (var k = 0; k < newGame.dice.length; k++) {
        document.getElementById("d" + (k + 1)).className = "himg";
      }

      if (i == 0) {
        for (var k = 0; k < 2; k++) {
          newGame.tempScore += 1000;
          myMessage.innerHTML += "<p class=\"good\">You rolled three 1's!" +
            "<br />+1000<br /></p>";
        }
      } else {
        var add = ((i + 1) * 100);
        for (var k = 0; k < 2; k++) {
          newGame.tempScore += add;
          myMessage.innerHTML += "<p class=\"good\">You rolled three " +
            (i + 1) + "'s!<br />+" + add + "<br /></p>";
        }
      }
    }
  }
  return hasPair;
}

function nextTurn() {
  myError.innerHTML = "";
  newGame.scores[newGame.turn] += newGame.tempScore;
  newGame.tempScore = 0;
  newGame.dice.length = 6;
  newGame.noMatches = false;
  newGame.hotDice = false;
  newGame.farkle = false;
  newGame.rolls = 0;
  newGame.rollsHD = 0;

  if ((newGame.turn + 1) == newGame.playerNum) {
    newGame.turn = 0;
  } else {
    newGame.turn++;
  }
  myScore.innerHTML = newGame.scoreUpdate();
}

function reset() {
  newGame.playerNum = 0;
  newGame.winner = false;
  newGame.players = [];
  newGame.dice = [0, 0, 0, 0, 0, 0];
  newGame.tempScore = 0;
  newGame.scores = [];
  newGame.turn = 0;
  newGame.noMatches = false;
  newGame.hotDice = false;
  newGame.farkle = 0;
  newGame.rolls = 0;
  document.getElementById("game").className = "offGame";
  document.getElementById("score").className = "offGame"
  document.getElementById("ja").className = "offGame";
  document.getElementById("players").value = "";
  document.getElementById("reset").className = "on";
  myMessage.innerHTML = "";
  myError.innerHTML = "";
  myScore.innerHTML = "";
  myPlayers.innerHTML = "";
  myHD.innerHTML = "";
}
