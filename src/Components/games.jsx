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
  const [timeLeft, setTimeLeft] = useState(60); // Initial time set to 60 seconds
  const [submitted, setSubmitted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const timerRef = useRef(null);
  const chatRef = useRef();
  const roundTimerRef = useRef(null);

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
  };

  const startRoundTimer = (duration) => {
    clearInterval(roundTimerRef.current); // Clear any existing interval
    setRoundTimer(duration);
    roundTimerRef.current = setInterval(() => {
      setRoundTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(roundTimerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(60);
    setTimeExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setTimeExpired(true);
          setCapture(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleCaptureClick = () => {
    playClickSound();
    setCapture(true);
    clearInterval(timerRef.current);
  };

  const handleRetakeClick = () => {
    playClickSound();
    setCapture(false);
    startTimer();
  };

  const handleSubmitClick = () => {
    playClickSound();
    setSubmitted(true);
    setCapture(false);
    clearInterval(timerRef.current);
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
        clearInterval(timerRef.current);
        setRoundTimer(0);
        startRoundTimer(data.time);
        setRound(data.round);
        setObject(data.object);
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
      clearInterval(roundTimerRef.current); // Clear interval on unmount
    };
  }, [socket]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current); // Cleanup timer on component unmount
  }, []);

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
          <h2>{timeLeft}s left</h2> {/* Correctly displaying roundTimer */}
        </div>
        <div className="object_data">
          <h2>Score: {leaderboard.find(player => player.username === user)?.points || 0}</h2>
          <h2>Round: {round}</h2>
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
