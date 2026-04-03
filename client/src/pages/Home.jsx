import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigae = useNavigate();
    navigae("/login");
  return (
    <div>
      Home
    </div>
  )
}

export default Home
