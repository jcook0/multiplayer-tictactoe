import React from 'react'
import './board.scss';

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.processMove = this.processMove.bind(this);
  }

  processMove(node) {

    var index = 0;
    while ( (node = node.previousElementSibling) ) {
        index++;
    }
    this.props.makeMove(index);
  }

  updateBoard() {
    let gameState = this.props.gameState;
    let processMove = this.processMove;

    document.querySelectorAll('div.box').forEach(function(element, index, array) {
      element.addEventListener('click', function() {
        processMove(element);
      })

      element.textContent = gameState[index];
    })

  }

  render() {
    return (
      <div class="board">
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        {this.updateBoard()}
      </div>
    );
  }
}

export default Board;
