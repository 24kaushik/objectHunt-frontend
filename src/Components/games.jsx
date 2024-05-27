import React, { useState, useRef, useEffect } from 'react';
import "../App.css";
import { MdChat, MdLeaderboard } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import clickSound from '../assets/sound/mouseclick.mp3';
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';

const Games = () => {
  const audioRef = useRef(null);
  const socket = useSocket();
  const { user } = useUser();

  const [capture, setCapture] = useState(false);
  const [leader, setLeader] = useState(false);
  const [message, setMessage] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [round, setRound] = useState(0);
  const [roundTimer, setRoundTimer] = useState(0);  // Initialized properly
  const [object, setObject] = useState("Object");
  const [chat, setChat] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const chatRef = useRef();

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const toggleCapture = () => {
    setCapture(!capture);
  };

  const toggleChat = () => {
    setLeader(false);
  };

  const toggleLeader = () => {
    setLeader(true);
  }

  let roundInterval;
  let remainingTime;

  function startRoundInterval(time) {
    remainingTime = time / 1000;
    roundInterval = setInterval(() => {
      setRoundTimer(prevValue => {
        return prevValue + 1;
      });
    }, 1000);
  };

  

  const handleCaptureClick = () => {
    playClickSound();
    setCapture(true);
  };

  const handleRetakeClick = () => {
    playClickSound();
    setCapture(false);
  };

  const handleSubmitClick = () => {
    playClickSound();
    setSubmitted(true);
    setCapture(false);
  };

  useEffect(() => {
    socket.on("message", (data) => {
      setMessage((prevMessage) => [...prevMessage, { msg: data, type: "message" }]);
    });
    socket.on("leaderboard", (data) => {
      setLeaderboard(data);
    });
    socket.on("game", (data) => {
      if (data.round !== undefined) {
        setRound(data.round);
      }
      if (data.msg === "round started") {
        setRoundTimer(0);
        startRoundInterval(data.time)
        setRound(data.round)
        setObject(data.object)
      } else if (data.msg === "round ended") {
        clearInterval(roundInterval)
        setRoundTimer(0);
        setObject("...")
      }
      else if (data.msg === "Match ended") {
        clearInterval(roundInterval)
        setRoundTimer(0);
        setRound(0)
        setObject("Object")
      }
    });
    socket.on('newplayer', (data) => {
      setMessage((prevMessage) => [...prevMessage, { msg: data, type: "newplayer" }]);
    });

    return () => {
      socket.off("message");
      socket.off("leaderboard");
      socket.off("game");
      socket.off("newplayer");
    };
  }, [socket]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [message]);

  const handleChatChange = (e) => {
    setChat(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (chat !== "") {
      socket.emit("message", chat);
      setChat("");
    }
  };

  return (
    <>
      <section className="game_container">
        <div className="object_data">
          <h1>Find {"aeiouAEIOU".includes(object[0]) ? "An" : "A"} {object}</h1>
          {roundTimer !== 0 && <h2>{import.meta.env.VITE_ROUND_TIME - roundTimer}s left</h2>}
        </div>
        <div className="object_data">
          <h2>Score:{leaderboard.map((player) => { if (player.username === user) { return player.points } })}</h2>
          {round !== 0 && <h2>Round:{round}</h2>}
        </div>
        <div className="image_area">
          {timeExpired && !submitted && <p>Time's up! Try Again.</p>}
        </div>

        <div className="click_button" onClick={toggleCapture}>
          {capture ? (
            <div className="submit_button show">
              <button className="submit_btn" onClick={handleSubmitClick}>Submit</button>
              <button className="retake_btn" onClick={handleRetakeClick}>Retake</button>
            </div>
          ) : (
            <button className='capture' onClick={handleCaptureClick}>Capture</button>
          )}
        </div>
        <div className="chat_leader">
          <button onClick={() => { toggleChat(); playClickSound(); }} className={!leader ? 'active' : ''}>
            <MdChat className='btn_icon' />Chat
          </button>
          <button onClick={() => { toggleLeader(); playClickSound(); }} className={leader ? 'active' : ''}>
            <MdLeaderboard className='btn_icon' />Leaderboard
          </button>
        </div>
        <div className={!leader ? 'box_display show' : 'box_display menu_chat'}>
          <div className="chat_data" ref={chatRef}>
            {message.map((data, ind) => (
              <div key={ind} className={`chat_msg ${data.type === "newplayer" ? "new_player" : ""}`}>
                <IoPerson className='person' />
                <p>{data.msg}</p>
              </div>
            ))}
          </div>
          <form className='chat_send' onSubmit={handleSend}>
            <input type="text" className='chat_input' value={chat} onChange={handleChatChange} />
            <button type='submit' className='btn_chat_send'>Send</button>
          </form>
        </div>
        <div className={leader ? 'box_display show' : 'box_display'}>
          <div className="leader_data">
            <table className='table'>
              <tbody>
                <tr className='row head'>
                  <th>#</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
                {leaderboard.map((player, index) => (
                  <tr key={index} className='row col_data'>
                    <td>{index + 1}</td>
                    <td>{player.username}</td>
                    <td>{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <audio ref={audioRef} src={clickSound} />
    </>
  );
};

export default Games;
