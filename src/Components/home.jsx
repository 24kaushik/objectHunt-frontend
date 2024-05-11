import React, { useState ,useRef } from 'react'
import { Link } from 'react-router-dom';
import "../App.css"
import clickSound from '../assets/sound/mouseclick.mp3';
const home = () => {
  const audioRef = useRef(null);

  const playClickSound = () => {
       
    if (audioRef.current) {
        audioRef.current.play();
    }
};
  return (
    <>
     <div className="home_head">
      <h1>WELCOME TO <br/>OBJECT HUNT</h1>
    
    <Link to="/start"> <button className='btn2' onClick={playClickSound}>Start</button></Link>
    </div>
    

    </>
  )
}

export default home;