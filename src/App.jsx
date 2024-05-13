// App.jsx
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Game from './Routes/game';
import Intro from './Routes/intro';
import Room from './Routes/room';
import Start from './Routes/start';
import './App.css';
import backgroundMusic from "./assets/sound/gameaudio.mp3"
import UserProvider from './context/UserContext';
import Error from './Components/Error';
import { useSocket } from './context/SocketContext';
import { useError } from './context/ErrorContext';
const App = () => {

  const [backgroundAudio] = useState(new Audio(backgroundMusic));
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(50);

  // Function to toggle music state and play or pause background music
  const toggleSound = () => {
    setMusicEnabled(!musicEnabled);
    if (musicEnabled) {
      backgroundAudio.pause();
    } else {
      backgroundAudio.volume = volume / 100;
      backgroundAudio.loop = true;
      backgroundAudio.play();
    }
  };

  // Function to handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    backgroundAudio.volume = newVolume / 100;
  };

  // Play background music when the component mounts
  useEffect(() => {
    if (musicEnabled) {
      backgroundAudio.volume = volume / 100;
      backgroundAudio.loop = true;
      backgroundAudio.play();
    }
    // Clean up function to stop background music when component unmounts
    return () => {
      backgroundAudio.pause();
    };
  }, [musicEnabled]); // Only re-run the effect if musicEnabled state changes

  const socket = useSocket();
  const {setError} = useError();

  useEffect(()=>{
    socket.on("error", (msg)=>{
      setError(msg);
    })
  },[socket])

  return (
    
      <UserProvider>
        <section className="main">
          <Error />
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/start" element={<Start />} />
            <Route path="/room" element={<Room
              musicEnabled={musicEnabled}
              toggleSound={toggleSound}
              volume={volume}
              handleVolumeChange={handleVolumeChange}
            />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </section>
      </UserProvider>
    
  );
};

export default App;
