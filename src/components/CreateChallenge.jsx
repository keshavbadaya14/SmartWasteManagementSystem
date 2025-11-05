import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreateChallenge.css';
import Navbar from './Navbar';

const CreateChallenge = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState('');
  const [scope, setScope] = useState('Public');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5002/community-challenges', {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        goal: parseFloat(goal),
        category,
        scope
      }, {
        withCredentials: true
      });
      setSuccess(response.data.message);
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setGoal('');
      setCategory('');
      setScope('Public');
      setTimeout(() => navigate('/community-challenges'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="create-challenge-container">
      <Navbar />
      <section className="create-challenge-section">
        <div className="create-challenge-form">
          <h1>Create a New Challenge</h1>
          <form onSubmit={handleCreateChallenge}>
            <div className="form-group">
              <label htmlFor="name">Challenge Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Zero Waste Week"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional):</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Reduce plastic waste by 20%"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="goal">Goal (kg):</label>
              <input
                type="number"
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., 50"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select category</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Organic">Organic</option>
                <option value="Hazardous">Hazardous</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="scope">Scope:</label>
              <select
                id="scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Challenge'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
      </section>
    </div>
  );
};

export default CreateChallenge;