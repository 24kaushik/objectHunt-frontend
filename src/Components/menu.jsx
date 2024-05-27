import React, { useState, useRef } from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import { IoSettings } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { FaVolumeMute } from "react-icons/fa";
import clickSound from '../assets/sound/mouseclick.mp3';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { useError } from '../context/ErrorContext';

const Menu = ({ toggleSound, musicEnabled, volume, handleVolumeChange }) => {

  const audioRef = useRef(null);
  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const [guide, setGuide] = useState(false);
  const toggleGuide = () => {
    setGuide(!guide);
  };

  const [join, setJoin] = useState(false);
  const toggleJoin = () => {
    setJoin(!join);
  };

  const [music, setMusic] = useState(false);
  const toggleMusic = () => {
    setMusic(!music);
  };

  const { user, setUser } = useUser();
  const socket = useSocket();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState(user || '');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const joinRandomRoom = async () => {
    if (inputValue) {
      await setUser(inputValue.trim());
      await socket.emit("joinRandom", { username: inputValue.trim() });
      navigate("/game");
    }
  };

  const createRoom = async () => {
    if (inputValue) {
      await setUser(inputValue.trim());
      await socket.emit("createRoom", { username: inputValue.trim() });
      navigate("/game");
    }
  };
  const { setError } = useError();

  const [code, setCode] = useState(undefined);
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  }
  const joinRoomById = async (e) => {
    e.preventDefault()
    if (code !== undefined) {
      const data = await fetch(import.meta.env.VITE_HOST + "/room/checkRoom/" + code);
      const response = await data.json();
      console.log(response)
      if (response.success) {
        await setUser(inputValue.trim());
        await socket.emit("joinById", JSON.stringify({ username: inputValue.trim(), roomId: code }));
        navigate("/game");
      }
      else {
        setError("Room not found!")
      }
    }
  }

  return (
    <>
      <div className="menu_container">
        <div className="input_data">
          <h1>Enter Your Name</h1>
          <input
            type="text"
            placeholder='Enter your username here'
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>

        {!inputValue && <p className='error'>Please insert your name.</p>}

        <button className="btn1" onClick={() => { joinRandomRoom(); playClickSound(); }} disabled={!inputValue}>
          Let's Play
        </button>

        <div className="room_btn">
          <button className='btn2' disabled={!inputValue} onClick={() => { createRoom(); playClickSound(); }}>
            Create Room
          </button>
          <button className='btn2' disabled={!inputValue} onClick={() => { toggleJoin(); playClickSound(); }}>
            Join Room
          </button>
        </div>

        <div className="menu_icons">
          <IoSettings className='icons' onClick={() => { toggleSettings(); playClickSound(); }} />
          <FaQuestion className='icons' onClick={() => { toggleGuide(); playClickSound(); }} />
        </div>
      </div>

      <div className={settingsOpen ? "menu_display show" : "menu_display"}>
        <h1>Settings</h1>
        <div className="setting_data">
          <h3>Sounds</h3>
          <h2 onClick={() => { toggleMusic(); toggleSound(); }}>{music ? <FaVolumeMute /> : <AiFillSound />}</h2>
        </div>
        <div className="setting_data">
          <h3>Music</h3>
          <input type="range" name="volume" min="0" max="100" value={volume} onChange={handleVolumeChange} />
        </div>
        <div className="setting_data">
          <p>Developed by <br /> Insanity crew games</p>
          <button className='db_2' onClick={() => { toggleSettings(); playClickSound(); }}>Close</button>
        </div>
      </div>

      <div className={guide ? 'menu_display show' : 'menu_display'}>
        <h1>How To Play</h1>
        <ul className='guide_list'>
          <li>Gather Players: Get a group together.</li>
          <li>Set Rules: Establish boundaries and rules.</li>
          <li>Define Objects: Decide what to hunt for.</li>
          <li>Start Hunt: Give a time limit and begin.</li>
        </ul>
        <div className="display_icons">
          <button className="db_2" onClick={() => { toggleGuide(); playClickSound(); }}>Close</button>
        </div>
      </div>

      <div className={join ? "menu_display show" : "menu_display"}>
        <h1>Join Room</h1>
        <p>CODE<input
          type="text"
          placeholder='Type Here'
          className='display_input'
          value={code}
          onChange={handleCodeChange}
        /></p>
        {!code && <p className='error'>Please insert code</p>}
        <div className="display_icons">
          <Link to="/game">
            <button className='db_1' onClick={(e) => { joinRoomById(e); toggleJoin(); }} disabled={!code}>Join</button>
          </Link>
          <button className='db_2' onClick={() => { toggleJoin(); playClickSound(); }}>Close</button>
        </div>
      </div>

      <audio ref={audioRef} src={clickSound} />
    </>
  );
};

export default Menu;
