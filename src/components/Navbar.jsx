import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import { FaRecycle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5003/profile', {
          withCredentials: true
        });
        setUser(response.data.user);
      } catch (err) {
        setUser(null); // No user logged in
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5003/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/"><FaRecycle style={{ color: 'white', fontSize: '32px', position: 'relative', top: '7px' }} /> SmartWaste</Link>
      </div>
      <div className="nav-links">
        <Link to="/sort-waste">Sort Waste</Link>
        <Link to="/schedule-pickup">Schedule Pickup</Link>
        <Link to="/learn-recycling">Handle Waste</Link>
        <Link to="/community-challenges">Community Challenges</Link>
      </div>
      <div className="user-links">
        {user ? (
          <>
            {/* <Link to="/profile">{user.name || user.email}</Link> */}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;