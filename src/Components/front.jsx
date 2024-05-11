import React, { useState, useRef } from 'react';
import "../App.css"
import { Link } from 'react-router-dom';
// import menu from './menu'
import clickSound from '../assets/sound/mouseclick.mp3';
const front = () => {

    const [guide,setGuide] = useState(false);

      // Create a reference to the audio element
    const audioRef = useRef(null);

    const toggleGuide = () => {
        setGuide(!guide);
    };

    const playClickSound = () => {
       
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
  return (
   <>
    <section className="start">
        <Link to="/room"><button className='btn1' onClick={playClickSound}>
            Play As Guest
        </button></Link>
        <button className='btn2' onClick={() => { toggleGuide(); playClickSound(); }}>
            How to Play
        </button>
    </section>

    <div className={guide ? 'menu_display show' : 'menu_display'}>
        <h1>How To Play</h1>
        <ul className='guide_list'>
          <li>This is 1st</li>
          <li>This is 2nd</li>
          <li>This is 3rd</li>
          <li>This is 4th</li>
        </ul>
        <div className="display_icons">
          <button className="db_2" onClick={() => { toggleGuide(); playClickSound(); }}>Close</button>
        </div>
    </div>
    <audio ref={audioRef} src={clickSound} />
   </>
  )
}

export default front;