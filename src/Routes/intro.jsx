import React from 'react'
import Home from '../Components/home'
import logo from "../assets/logo.png";
import "../App.css"
const intro = () => {
  return (
    <>
    <div className="start_container">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="start_data">
          <Home/>
          </div>
        </div>
      
    </>
  )
}

export default intro