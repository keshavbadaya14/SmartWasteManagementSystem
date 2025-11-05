import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/SortWaste.css';
import { useNavigate } from 'react-router-dom';

const SortWaste = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5003/profile', { withCredentials: true });
      } catch (err) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/sort', {
        itemName,
        description,
      }, {
        headers: { 'Content-Type': 'application/json'},
        withCredentials: true
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to classify waste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sort-waste">
      <Navbar />
      <section className="sort-waste-section">
        <h1>Sort Your Waste</h1>
        <br />
        <p>Enter the item details to find out how to dispose of it properly.</p>
        <form onSubmit={handleSubmit} className="sort-form">
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Plastic Bottle"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Empty water bottle"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Classifying...' : 'Classify Waste'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {result && (
          <div className="result">
            <h2>Result</h2>
            <p className={`category ${result.category.toLowerCase().replace(' ', '-')}`}>
              {result.message}
            </p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SortWaste;