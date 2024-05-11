import React, { useState ,useRef } from 'react'
import "../App.css"
import { MdChat } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { IoPerson } from "react-icons/io5";
import clickSound from '../assets/sound/mouseclick.mp3';
const games = () => {
  const audioRef = useRef(null);

  const playClickSound = () => {
       
    if (audioRef.current) {
        audioRef.current.play();
    }
};


  const[capture,setCapture] = useState(false);

  const toggleCapture =()=>{
    setCapture(!capture);
  }

  const[chat,setChat] = useState(false);

  const toggleChat = () => {
    setChat(true);
    setLeader(false);
  }
  const[leader,setLeader] = useState(false);
  const toggleLeader = () => {
    setChat(false);
    setLeader(true);
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
      <button onClick={() => { toggleChat(); playClickSound(); }} className={chat ? 'active' : ''}>
          <MdChat className='btn_icon' />Chat
        </button>
        <button onClick={() => { toggleLeader(); playClickSound(); }} className={leader ? 'active' : ''}>
          <MdLeaderboard className='btn_icon' />Leaderboard
        </button>
      </div>
      <div className={chat ? 'box_display show' : 'box_display menu_chat'}>
      
      <div className="chat_data">
        <div className="data_1">
          <IoPerson className='person'/>
          <p>Hello dear</p>
        </div>
        <div className="data_2">
          <IoPerson className='person'/>
          <p>Hello</p>
        </div>
      </div>
      
     
  </div>

  <div className={leader ? 'box_display show' : 'box_display'}>
    
      <div className="leader_data">
      <table className='table'>
       <tr className='row head'>
         <th>#</th>
         <th>Name</th>
         <th>Score</th>
       </tr>
        <tr className='row col_data'>
           <td>1.</td>
           <td>Maria</td>
  <        td>20</td>
       </tr>
       <tr className='row col_data'>
        <td>2.</td>
          <td>Francisco</td>
           <td>10</td>
         </tr>

</table>
      </div>
     
  </div>
     </section>
     

 

    <audio ref={audioRef} src={clickSound} />
    </>
  )
}

export default games
