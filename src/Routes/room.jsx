import React, { useEffect } from 'react'
import "../App.css"
import Menu from "../Components/menu"
import logo from "../assets/logo.png";
import { useSocket } from '../context/SocketContext';

const room = ({ toggleSound, musicEnabled, volume, handleVolumeChange }) => {
  const socket = useSocket();
  useEffect(()=>{
    if(!socket.connected){
      window.location.href = '/';
    }
    
    console.log(socket)
  },[])
  return (
    <>
      <div className="start_container">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="room_data">
          <Menu
            toggleSound={toggleSound}
            musicEnabled={musicEnabled}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </>
  )
}

export default room
