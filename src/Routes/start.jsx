// start.jsx
import React from 'react';
import logo from "../assets/logo.png";
import Front from "../Components/front";
import "../App.css"
const Start = () => {

  return (
    <>
    <div className="start_container">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="start_data">
          <Front/>
          </div>
        </div>
      
    </>
  );
};

export default Start;
