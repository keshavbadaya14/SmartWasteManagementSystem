import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5003/profile', {
          withCredentials: true
        });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5003/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h1>User Profile</h1>
      {error && <p className="error">{error}</p>}
      {user && (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;