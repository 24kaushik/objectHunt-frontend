import React, { useEffect } from 'react'
import Game from "../Components/games";
import { useUser } from '../context/UserContext';
import { useError } from '../context/ErrorContext';
import { useNavigate } from 'react-router-dom';

const game = () => {
  const { user } = useUser();
  const { error, setError } = useError();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      setError("Please enter your username first")
      navigate("/room");
    }
  }, [user])
  return (
    <div className="start_container">
      <div className="game_data">
        <Game />
      </div>
    </div>
  )
}

export default game
