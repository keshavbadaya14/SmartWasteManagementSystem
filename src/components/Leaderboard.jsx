import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Leaderboard.css';
import Navbar from './Navbar';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndLeaderboard = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5003/profile', {
          withCredentials: true
        });
        setUser(userResponse.data.user);

        const leaderboardResponse = await axios.get('http://localhost:5002/leaderboard', {
          withCredentials: true
        });
        setLeaderboard(leaderboardResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchUserAndLeaderboard();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="leaderboard-container">
      <Navbar />
      <section className="leaderboard-section">
        <div className="leaderboard-table">
          <h1>Community Leaderboard</h1>
          {error && <p className="error">{error}</p>}
          {leaderboard.length === 0 ? (
            <p>No leaderboard data available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.user_id}>
                    <td>{index + 1}</td>
                    <td>{entry.email}</td>
                    <td>{entry.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;