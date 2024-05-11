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
          <li>Gather Players: Get a group together.</li>
          <li>Set Rules: Establish boundaries and rules.</li>
          <li>Define Objects: Decide what to hunt for.</li>
          <li>Start Hunt: Give a time limit and begin.
</li>
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
