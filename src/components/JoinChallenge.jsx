import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/JoinChallenge.css';
import Navbar from './Navbar';

const JoinChallenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndChallenges = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5003/profile', {
          withCredentials: true,
          timeout: 5000
        });
        setUser(userResponse.data.user);

        const challengesResponse = await axios.get('http://localhost:5002/community-challenges', {
          withCredentials: true,
          timeout: 5000
        });
        console.log('Challenges response:', challengesResponse.data);
        setChallenges(challengesResponse.data);

        // Fetch completed and pending challenges
        const completedResponse = await axios.get('http://localhost:5002/challenge-logs', {
          withCredentials: true,
          timeout: 5000
        });
        const pendingResponse = await axios.get('http://localhost:5002/pending-completions', {
          withCredentials: true,
          timeout: 5000
        });
        console.log('Completed challenges response:', completedResponse.data);
        console.log('Pending completions response:', pendingResponse.data);
        const completed = new Set([
          ...completedResponse.data.map(log => log.challenge_id),
          ...pendingResponse.data.map(log => log.challenge_id)
        ]);
        setCompletedChallenges(completed);
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'An error occurred');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchUserAndChallenges();
  }, [navigate]);

  const handleCheckboxChange = async (challengeId, name, category) => {
    const newCompleted = new Set(completedChallenges);
    const completed = newCompleted.has(challengeId);
    if (completed) {
      newCompleted.delete(challengeId);
    } else {
      newCompleted.add(challengeId);
    }
    setCompletedChallenges(newCompleted);

    try {
      await axios.post('http://localhost:5002/complete-challenge', {
        challenge_id: challengeId,
        completed: !completed
      }, {
        withCredentials: true,
        timeout: 5000
      });
    } catch (err) {
      console.error('Complete challenge error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update challenge');
      newCompleted.delete(challengeId); // Revert on error
      setCompletedChallenges(new Set(newCompleted));
    }
  };

  if (!user) return null;

  return (
    <div className="join-challenge-container">
      <Navbar />
      <section className="join-challenge-section">
        <div className="join-challenge-notebook">
          <h1>Challenges for This Week</h1>
          {error && <p className="error">{error}</p>}
          {challenges.length === 0 ? (
            <p>No challenges available this week.</p>
          ) : (
            <ul>
              {challenges.map(challenge => (
                <li key={challenge.id} className={completedChallenges.has(challenge.id) ? 'completed' : ''}>
                  <label>
                    <input
                      type="checkbox"
                      checked={completedChallenges.has(challenge.id)}
                      onChange={() => handleCheckboxChange(challenge.id, challenge.name, challenge.category)}
                    />
                    <span>{challenge.name} ({challenge.category}, Goal: {challenge.goal}kg)</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default JoinChallenge;