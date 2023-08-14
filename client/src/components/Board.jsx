import React from 'react'
import './board.scss';

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.processMove = this.processMove.bind(this);
  }

  processMove(element) {
    let index = element.getAttribute('data-key');
    this.props.makeMove(index);
  }

  render() {
    return (
      <div className="board m-8">
          {Array(9).fill(true).map((_, i) =>
            <div className="square" data-key={i} onClick={e => this.processMove(e.target)}>
              {this.props.board[i]}
            </div>
          )}
      </div>
    );
  }
}

export default Board;
