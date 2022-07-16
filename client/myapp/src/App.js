
import './App.scss';
import Home from './pages';
import Game from './pages/game';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import io from 'socket.io-client'
import { useState } from "react";

let socket = io.connect("http://localhost:3001")

function App() {

  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(0)
  const [turn, setTurn] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [boxes, setBoxes] = useState(Array(9).fill(null))
  const [makingMove, setMakingMove] = useState(false)

  function getSymbol() {
    return player == 0 ? "X" : "O";
  }

  function calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
        return "The winner is " + boxes[a] + "!";
      }
    }

    let filledBoxes = 0;
    for (let i = 0; i< boxes.length; i++) {
      if (boxes[i]) {
        filledBoxes++;
      }
    }

    if (filledBoxes == boxes.length) {
      return "Draw";
    } else {
      return null;
    }
  }

  function makeMove(boxNumber) {
    if (turn != player) {
      return;
    }
    if (gameOver || !gameStarted) {
      return;
    }
    if (makingMove) {
      return;
    }

    setMakingMove(true)

    socket.emit("send_move", {room: room, num: boxNumber, symbol: getSymbol() })
  }

  function newRoom() {
    socket.emit("new_room")
  }

  function joinRoom(roomCode) {
    socket.emit("join_room", roomCode)
  }
  
  socket.on("receive_move", (boxNumber, symbol) => {
    if (symbol == getSymbol()) {
      setMakingMove(false)
    }
    let newBoxes = boxes
    newBoxes[boxNumber] = symbol

    setTurn(turn == 1 ? 0 : 1)
    setBoxes(newBoxes)

    let winner = calculateWinner()
    if (winner) {
      console.log(winner);
      setGameOver(true)
    }
  })

  socket.on("start", () => {
    setGameStarted(true)
  })

  socket.on("room", (roomCode, number) => {
    setRoom(roomCode)
    setPlayer(number)
  })

  return (
    <>
    <h1>Tic-tac-toe</h1>
    <div class="main">
      <Router>
      <Routes>
          <Route exact path='/' element={<Home newRoom={newRoom} joinRoom={joinRoom} />} />
          <Route exact path='/game' element={<Game gameStarted={gameStarted} makeMove = {makeMove} roomCode= {room} playerId={player} turn={turn} game={gameOver} gameState={boxes} setGameState={setBoxes} />} />
      </Routes>
      </Router>
    </div>
    </>
  );
}

export default App;
