import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Schedule.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SchedulePickup = () => {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
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
        navigate('/login'); // Redirect to login if unauthenticated
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5002/schedule-pickup', {
        pickupDate,
        pickupTime,
        wasteType,
        address,
        notes
      }, {
        withCredentials: true
      });
      setSuccess(response.data.message);
      setPickupDate('');
      setPickupTime('');
      setWasteType('');
      setAddress('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Prevent rendering until auth check

  return (
    <div className="pickup-container">
      <Navbar />
      <section className="pickup-section">
        <div className="pickup-form">
          <h1>Schedule Waste Pickup</h1>
          <form onSubmit={handleSubmit}>
            <div className="pickup-form-group">
              <label htmlFor="pickupDate">Pickup Date:</label>
              <input
                type="date"
                id="pickupDate"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>
            <div className="pickup-form-group">
              <label htmlFor="pickupTime">Pickup Time:</label>
              <select
                id="pickupTime"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              >
                <option value="" disabled>Select time slot</option>
                <option value="Morning (8-11 AM)">Morning (8-11 AM)</option>
                <option value="Afternoon (12-3 PM)">Afternoon (12-3 PM)</option>
                <option value="Evening (4-7 PM)">Evening (4-7 PM)</option>
              </select>
            </div>
            <div className="pickup-form-group">
              <label htmlFor="wasteType">Waste Type:</label>
              <select
                id="wasteType"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                required
              >
                <option value="" disabled>Select waste type</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Organic">Organic</option>
                <option value="Hazardous">Hazardous</option>
              </select>
            </div>
            <div className="pickup-form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter pickup address"
                required
              />
            </div>
            <div className="pickup-form-group">
              <label htmlFor="notes">Notes (Optional):</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Leave bins at curb"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Pickup'}
            </button>
          </form>
          {error && <p className="pickup-error">{error}</p>}
          {success && <p className="pickup-success">{success}</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SchedulePickup;