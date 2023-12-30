const gameBoard = (function () {
    board = [[" ", " ", " "],
             [" ", " ", " "],
             [" ", " ", " "]];
    
    const getBoard = () => {
      return board;
    }
    
    const updateBoard = (marker, location) => {
      board[location[0]][location[1]] = marker;
    }
    
    const clearBoard = () => {
      for (let i = 0; i < board.length; i++) {
        for (let ii = 0; ii < board[i].length; ii++) {
          board[i][ii] = " ";
        }
      }
    }
    
    return { getBoard: getBoard, updateBoard: updateBoard, clearBoard: clearBoard };
  })();
  
  function createPlayer(marker) {
    
    return { marker: marker };
  }
  
  const gameController = (function () {
    let players = []
    let activePlayer = 0;
    let gameOver = false;
    
    let nodes = document.querySelectorAll('.location');
    
    const playGame = () => {
      startGame();
    }
    
    const startGame = () => {
      restartGame();
      
      let player1 = players.push(createPlayer('O'));
      let player2 = players.push(createPlayer('X'));
    }
    
    const playTurn = (location) => {
      if (gameOver) {
        return;
      }
      
      let pieceLocation = location.substring(1);
      
      let board = gameBoard.getBoard();
      
      let spot = board[pieceLocation[0]][pieceLocation[1]];
      
      if (spot == " ") {
        gameBoard.updateBoard(players[activePlayer].marker, pieceLocation);
        if (activePlayer == 0) {
          activePlayer = 1;
        } else {
          activePlayer = 0;
        }
        displayController.displayBoard();
      }
      
      if (gameEnded()) {
        if (activePlayer == 0) {
          endGame('Player 2');
        } else {
          endGame('Player 1')
        }
      }
    }
    
    const gameEnded = () => {
      let board = gameBoard.getBoard();
      let verticals = [[board[0][0], board[1][0], board[2][0]],
                       [board[0][1], board[1][1], board[2][1]],
                       [board[0][2], board[1][2], board[2][2]]];
      let diagonals = [[board[0][0], board[1][1], board[2][2]],
                       [board[0][2], board[1][1], board[2][0]]];
      
      if ((board[0][0] != " " && allEqual(board[0])) ||
          (board[1][0] != " " && allEqual(board[1])) ||
          (board[2][0] != " " && allEqual(board[2])) ||
          (verticals[0][0] != " " && allEqual(verticals[0])) ||
          (verticals[1][0] != " " && allEqual(verticals[1])) ||
          (verticals[2][0] != " " && allEqual(verticals[2])) ||
          (diagonals[0][0] != " " && allEqual(diagonals[0])) ||
          (diagonals[1][0] != " " && allEqual(diagonals[1]))) {
          return true;
      } else {
        return false;
      }
    }
    
    const endGame = (player) => {
      displayController.displayWinner(player);
      gameOver = true;
    }
    
    const restartGame = () => {
      activePlayer = 0;
      gameBoard.clearBoard();
      clearDOM();
      gameOver = false;
    }
    
    const clearDOM = () => {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].textContent = " ";
      }
      displayController.clearDisplay();
    }
    
    const allEqual = arr => arr.every( v => v === arr[0] )
    
    return { playGame: playGame, playTurn: playTurn, restartGame: restartGame };
  })();
  
  const displayController = (function () {
    let board = gameBoard.getBoard();
    let textDisplay = document.querySelector('.text-display');
    
    const displayBoard = () => {
      for (let i = 0; i < board.length; i++) {
        console.log(board[i]);
        for (let ii = 0; ii < board[i].length; ii++) {
          let boardPosition = "A" + i + ii;
          document.querySelector(`#${boardPosition}`).textContent = board[i][ii];
        }
      }
    }
    
    const displayWinner = (winner) => {
      textDisplay.textContent = `${winner} wins!`;
    }
    
    const clearDisplay = () => {
      textDisplay.textContent = "";
    }
    
    return { displayBoard: displayBoard, displayWinner: displayWinner, clearDisplay: clearDisplay };
  })();
  
  let nodes = document.querySelectorAll('.location');
  const restartBtn = document.querySelector('#restartBtn');
    
  restartBtn.addEventListener('click', gameController.restartGame);
  
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].addEventListener('click', placeMarker);
  }
  
  function placeMarker(e) {
    gameController.playTurn(e.target.id);
  }
  
  gameController.playGame();
  