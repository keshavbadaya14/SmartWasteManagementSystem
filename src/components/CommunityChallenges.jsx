import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CommunityChallenges.css';
import Navbar from './Navbar';
import Footer from './Footer';

const CommunityChallenges = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5003/profile', {
          withCredentials: true
        });
        setUser(response.data.user);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="community-container">
      <Navbar />
      <div className="community-content">
        <div className="community-image"></div>
        <div className="community-info">
          <h1>Join the Green Revolution: Community Challenges</h1>
          <p>Collaborate, Reduce, Recycle – Make a Difference Together!</p>
          <div className="community-buttons">
            <button onClick={() => navigate('/join-challenge')}>
              Join Challenges
            </button>
            <button onClick={() => navigate('/create-challenge')}>
              Create Challenge
            </button>
            <button onClick={() => navigate('/leaderboard')}>
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityChallenges;