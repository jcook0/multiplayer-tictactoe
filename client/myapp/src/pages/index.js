import React from 'react';
import { useNavigate } from "react-router-dom";

const Home = ({newRoom, joinRoom}) => {

  let navigate  = useNavigate();

  function handleClick() { 
    newRoom();
    navigate('/game');
  }

  function handleClick2() {
    let roomCode = document.querySelector('input.roomCode').value

    if (roomCode.length >= 1) {
      joinRoom(roomCode)
      navigate('/game');
    }
  }

  return (
    <div>
      <button type="button" class="btn" onClick={handleClick}>Play</button>
      <br></br>
      <input type="text" class="roomCode" placeholder="Room Code"></input>
      <button type="button" onClick={handleClick2}>Join Room</button>
    </div>
  );
};
  
export default Home;