import React, { Component } from 'react';
import Board from '../components/Board.jsx';  

export class Game extends Component {

  handleClick() { 
    window.location = "/"
  }

  componentDidMount() {

  }

  getSymbol() {
    return this.props.playerId === 0 ? "X" : "O"
  }

  getGameMessage() {

    if (!this.props.gameStarted) {
      return "Waiting for opponent to join"
    }

    if (this.props.playerId === this.props.turn) {
      return "Your turn"
    } else {
      return "Opponent's turn"
    }
  }

  render() { 
    return (
      <div>
        <p>Room Code: {this.props.roomCode}</p>
        <p>You are playing as {this.getSymbol()}</p>
        <p>{this.getGameMessage()}</p>
        <Board makeMove = {this.props.makeMove} gameState={this.props.gameState} />
        <button class="btn" type="button" onClick={this.handleClick}>Leave Game</button>
      </div>
    ); 
  }
}

export default Game