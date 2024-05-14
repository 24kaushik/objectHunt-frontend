import React, { useState, useRef, useEffect } from 'react'
import "../App.css"
import { MdChat } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { IoPerson } from "react-icons/io5";
import clickSound from '../assets/sound/mouseclick.mp3';
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
const games = () => {
  const audioRef = useRef(null);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };


  const [capture, setCapture] = useState(false);

  const toggleCapture = () => {
    setCapture(!capture);
  }


  const toggleChat = () => {
    setLeader(false);
  }
  const [leader, setLeader] = useState(false);
  const toggleLeader = () => {
    setLeader(true);
  }

  const [message, setMessage] = useState([]);
  const socket = useSocket();

  const [leaderboard, setLeaderboard] = useState([]);
  const [round, setRound] = useState(0);
  const [roundTimer, setRoundTimer] = useState(0);
  const [object, setObject] = useState("Object")

  let roundInterval;
  let remainingTime;

  function startRoundInterval(time) {
    remainingTime = time / 1000;
    roundInterval = setInterval(() => {
      setRoundTimer(prevValue => {
        return prevValue + 1;
      });
    }, 1000);
  }

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessage(prevMessage => [...prevMessage, msg]);
    })
    socket.on("leaderboard", (data) => {
      setLeaderboard(data);
    });
    socket.on("game", (data) => {
      if (data.round !== undefined) {
        setRound(data.round)
      }
      if (data.msg === "round started") {
        console.log("round")
        clearInterval(roundInterval)
        setRoundTimer(0);
        startRoundInterval(data.time)
        setRound(data.round)
        setObject(data.object)
      }
    });

    return () => {
      socket.off("message");
      socket.off("leaderboard");
      socket.off("game");
    }
  }, [socket])

  const chatRef = useRef();
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [message]);

  const [chat, setChat] = useState("");
  const handleChat = (e) => {
    setChat(e.target.value)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (chat !== "") {
      socket.emit("message", chat)
      setChat("");
    }
  }

  const { user } = useUser();

  return (
    <>
      <section className="game_container">
        <div className="object_data">
          <h1>Find {"aeiouAEIOU".includes(object[0]) ? "An" : "A"} {object}</h1>
          <h2>{roundTimer}s left</h2>
        </div>
        <div className="object_data">
          <h2>Score:{leaderboard.map((player) => { if (player.username === user) { return player.points } })}</h2>
          <h2>Round:{round}</h2>
        </div>
        <div className="image_area">

        </div>

        <div className="click_button" onClick={() => { toggleCapture(); playClickSound(); }}>
          {capture ? (
            <div className="submit_button show">
              <button className="submit_btn">Submit</button>
              <button className="retake_btn" onClick={() => { toggleCapture(); playClickSound(); }}>Retake</button>
            </div>
          ) : (
            <button className='capture'>Capture</button>
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
            {message.map((msg, ind) => <div key={ind} className="chat_msg">
              <IoPerson className='person' />
              <p>{msg}</p>
            </div>)}
          </div>
          <form className='chat_send' onSubmit={handleSend}>
            <input type="text" className='chat_input' value={chat} onChange={handleChat} />
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
                {leaderboard.map((player, index) => <tr key={index} className='row col_data'>
                  <td>{index + 1}</td>
                  <td>{player.username}</td>
                  <td>{player.points}</td>
                </tr>)}
              </tbody>
            </table>
          </div>

        </div>
      </section>




      <audio ref={audioRef} src={clickSound} />
    </>
  )
}

export default games
