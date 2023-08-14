class Game {
  constructor() {
    this.board = new Array(9).fill(null);
    this.winStates = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    this.turn = 'X'
  }

  move(index, symbol) {
    if (this.board[index] == null && this.turn === symbol) {
      this.board[index] = symbol
      return true
    }
    return false
  }

  switchPlayerTurn() {
    this.turn = (this.turn ==='X' ? 'O' : 'X')
  }

  checkBoard(symbol) {
    let board = this.board
    for (let i = 0; i < this.winStates.length; i++) {
      const [a, b, c] = this.winStates[i];
      if (board[a] == symbol && board[a] === board[b] && board[a] === board[c]) {
        return "The winner is " + symbol + "!";
      }
    }

    let filledBoxes = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i]) {
        filledBoxes++;
      }
    }

    if (filledBoxes == board.length) {
      return "Draw.";
    } else {
      return null;
    }
  }
}

module.exports = Game;
