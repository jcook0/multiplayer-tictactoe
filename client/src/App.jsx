import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Home from './pages/Home';
import Game from './pages/Game';
import './App.scss';

export default function App() {
  //const [isConnected, setIsConnected] = useState(socket.connected);
  const [roomCode, setRoomCode] = useState(null);
  const [symbol, setSymbol] = useState('X');
  const [board, setBoard] = useState(new Array(9).fill(""))
  const [gameStarted, setGameStarted] = useState(false)
  const [gameMessage, setGameMessage] = useState("Waiting for opponent to join..");

  useEffect(() => {

    //socket.on('connect', onConnect);
    //socket.on('disconnect', onDisconnect);

    socket.on('joined-room', (newRoomCode, newSymbol) => {
      setRoomCode(newRoomCode)
      setSymbol(newSymbol)
    })

    socket.on('update', (newBoard, turn) => {
      setBoard(newBoard)
      setGameMessage("" + turn + "'s turn")
    })

    socket.on('game-start', (turn) => {
      setGameStarted(true)
      setGameMessage("Game started. " + turn + "'s turn")
    })

    socket.on("game-end", (gameMsg) => {
      setGameMessage(gameMsg)
    })

    // cleanup function
    return () => {
      //socket.off('connect');
      //socket.off('disconnect', onDisconnect);
      socket.off('joined-room');
      socket.off('update');
      socket.off('game-ended');
      socket.off('game-start');
    };
  }, []);

  return (
    <>
      <h1 className="text-3xl m-6">Multiplayer Tic-Tac-Toe</h1>
      <div className="main">
        <Router>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/game' element={<Game s={symbol} board={board} gameStarted={gameStarted} setBoard={setBoard} roomCode={roomCode} gameMessage={gameMessage} />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
