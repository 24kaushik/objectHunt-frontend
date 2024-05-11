import React ,{useState , useRef} from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
import { IoSettings } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import { FaVolumeMute } from "react-icons/fa";
import clickSound from '../assets/sound/mouseclick.mp3';
const menu = ({ toggleSound, musicEnabled, volume, handleVolumeChange }) => {

  const audioRef = useRef(null);
const playClickSound = () => {
        
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const [room,setRoom] = useState(false);

    const toggleRoom = () => {
        setRoom(!room);
    };

    const [join,setJoin] = useState(false);

    const toggleJoin = () => {
        setJoin(!join);
    };

    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
      };

      const [guide,setGuide] = useState(false);

      const toggleGuide = () => {
          setGuide(!guide);
      };
  
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };


    const [music,setMusic] = useState(false);

    const toggleMusic = ()=>{
        setMusic(!music);
    }
  return (
   <> 
      <div className="menu_container">
        <div className="input_data">
            <h1>Enter Your Name</h1>
            <input type="text" placeholder='Type Here'value={inputValue}
                        onChange={handleInputChange}/>
        </div>
        {!inputValue && <p className='error'>Please insert your name.</p>}
        <Link to="/game">
          <button className="btn1" onClick={() => { toggleJoin(); playClickSound(); }} disabled={!inputValue}>
            Let's Play
          </button>
        </Link>
        <div className="room_btn">
            <button className='btn2' onClick={() => { toggleRoom(); playClickSound(); }}>
                Create Room
            </button>
            <button className='btn2' onClick={() => { toggleJoin(); playClickSound(); }}>
                Join Room
            </button>
        </div>
       
        <div className="menu_icons">
         <IoSettings className='icons' onClick={() => { toggleSettings(); playClickSound(); }}/>
         <FaQuestion className='icons' onClick={() => { toggleGuide(); playClickSound(); }}/>
        </div>
    </div>

    <div className={room ? "menu_display show" : "menu_display"}>
       <h1>Create Room</h1>
       <p>This is room</p>
       <div className="display_icons">
        <Link to="/game"><button className='db_1'>Create</button></Link> 
        <button className='db_2' onClick={() => { toggleRoom(); playClickSound(); }}>Close</button>
       </div>
    </div>

    <div className={join ? "menu_display show" : "menu_display"}>
       <h1>Join Room</h1>
       <p>CODE<input type="text" placeholder='Type Here' className='display_input' value={inputValue}
                        onChange={handleInputChange}/></p>
       {!inputValue && <p className='error'>Please insert code</p>}
       <div className="display_icons">
        <Link to="/game"><button className='db_1'onClick={toggleJoin} disabled={!inputValue}>Join</button></Link>
        <button className='db_2' onClick={() => { toggleJoin(); playClickSound(); }}>Close</button>
       </div>
    </div>

    <div className={settingsOpen ? "menu_display show" : "menu_display"}>
       <h1>Settings</h1>
        <div className="setting_data">
            <h3>Sounds</h3>
            <h2 onClick={() => {toggleMusic(); toggleSound();}}>{music ?  <FaVolumeMute /> :<AiFillSound />}</h2>
        </div>
        <div className="setting_data">
        <h3>Music</h3>
        <input type="range" name="volume" min="0" max="100" value={volume} onChange={handleVolumeChange} />
       </div>
       <div className="setting_data">
        <p>Developed by <br/> Insanity crew games</p>
        <button className='db_2' onClick={() => { toggleSettings(); playClickSound(); }}>Close</button>
       </div>
    </div>



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

export default menu;