import React, { useRef } from 'react';
import Board from '../components/Board.jsx';
import "./game.scss"
import { socket } from '../socket.js';
//import { useNavigate } from 'react-router';

function Game({ roomCode, s, board, gameMessage, gameStarted }) {

  //const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleCopy = async () => {
    inputRef.current.select();
    await navigator.clipboard.writeText(roomCode);
  };

  function leaveRoom() {
    socket.emit("leave-room", { room: roomCode })
    window.location = "/"
  }

  function makeMove(i) {
    if (gameStarted) {
      socket.emit("move", { index: i, symbol: s, room: roomCode })
    }
  }

  return (
    <div class="">
      <div className="m-8">
        <p className="text-lg">You are playing as <b>{s}</b></p>
        <p className="text-lg">{gameMessage}</p>
      </div>
      <Board makeMove={makeMove} board={board} />
      <div className="">
        <div className="">
          <label for="code" class="block text-sm font-medium leading-3 text-gray-900">Room Code:</label>
          <input
            name="code" id="code"
            ref={inputRef}
            size="4"
            value={roomCode}
            readOnly
            className="px-4 py-2 border mt-2 mr-3 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer"
            onClick={handleCopy}
          />
          <button onClick={handleCopy} className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Copy</button><br></br>
        </div>
        <div className="">
          <button className="m-8 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" type="button" onClick={leaveRoom}>Leave Game</button>
        </div>
      </div>
    </div>
  );
}

export default Game