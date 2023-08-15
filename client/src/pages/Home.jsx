import React from 'react';
import { socket } from '../socket.js';
import { useNavigate } from 'react-router';

const Home = () => {

  const navigate = useNavigate();

  function handleClick() {
    socket.emit("new-room")
    navigate('/game');
  }

  function handleClick2() {
    let roomCode = document.querySelector('input.roomCode').value

    if (roomCode.length >= 1) {
      socket.emit("join-room",{room: roomCode})
      navigate('/game');
    }
  }

  return (
    <div className="container-lg m-8">
      <button type="button" className="rounded-lg m-4 bg-green-600 px-7 py-4 text-2xl font-bold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" onClick={handleClick}>Play</button>
      <br></br>
      <input type="text" size="10" className="roomCode mt-4 mr-3 px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Room Code"></input>
      <button type="button" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => handleClick2()}>Join Room</button>
    </div>
  );
};

export default Home;