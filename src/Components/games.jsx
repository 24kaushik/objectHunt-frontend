import React, { useState, useRef, useEffect } from 'react'
import "../App.css"
import { MdChat } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { IoPerson } from "react-icons/io5";
import clickSound from '../assets/sound/mouseclick.mp3';
import { useSocket } from '../context/SocketContext';
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

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessage(prevMessage => [...prevMessage, msg]);
    })
    socket.on("leaderboard", (data) => {
      setLeaderboard(data);
    });

    return () => {
      socket.off("message");
    }


  }, [socket])


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

  return (
    <>
      <section className="game_container">
        <div className="object_data">
          <h1>Find A Object</h1>
          <h2>0s left</h2>
        </div>
        <div className="object_data">
          <h2>Score:0</h2>
          <h2>Round:0</h2>
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

          <div className="chat_data">
            {message.map((msg) => <div className="chat_msg">
              <IoPerson className='person' />
              <p>{msg}</p>
            </div>)}
          </div>
          <form className='chat_send' onSubmit={handleSend}>
            <input type="text" className='chat_input' value={chat} onChange={handleChat} />
            <button type='submit' className='btn_chat_sen'>Send</button>
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
