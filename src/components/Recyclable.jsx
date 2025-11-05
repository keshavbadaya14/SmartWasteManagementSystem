import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Recyclable.css';

const Recyclable = () => {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5003/profile', {
          withCredentials: true,
          timeout: 5000,
        });
      } catch (err) {
        console.error('Auth check failed:', err.response?.data || err.message);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const steps = [
    { title: 'Check Local Guidelines', description: 'Review your local recycling rules.', image: '/images/recyclable_step1.png' },
    { title: 'Rinse Containers', description: 'Remove food residue from plastics, glass, and cans.', image: '/images/recyclable_step2.jpeg' },
    { title: 'Remove Non-Recyclables', description: 'Separate caps or labels if not recyclable.', image: '/images/recyclable_step3.jpeg' },
    { title: 'Flatten Cardboard', description: 'Break down boxes to save space.', image: '/images/recyclable_step4.jpeg' },
    { title: 'Sort by Material', description: 'Group plastics, paper, glass, and metals.', image: '/images/recyclable_step5.png' },
    { title: 'Avoid Contamination', description: 'Keep non-recyclables out of bins.', image: '/images/recyclable_step6.png' },
    { title: 'Remove Plastic Bags', description: 'Plastic bags often require separate recycling.', image: '/images/recyclable_step7.png' },
    { title: 'Clean Glass Jars', description: 'Ensure glass is free of residue.', image: '/images/recyclable_step8.png' },
    { title: 'Check Plastic Numbers', description: 'Look for resin codes (1–7) to confirm recyclability.', image: '/images/recyclable_step9.png' },
    { title: 'Bundle Paper', description: 'Tie newspapers or paper together if required.', image: '/images/recyclable_step10.png' },
    { title: 'Use Correct Bin', description: 'Place items in the blue recycling bin.', image: '/images/recyclable_step11.png' },
    { title: 'Schedule Pickup', description: 'Arrange for recycling collection if needed.', image: '/images/recyclable_step12.png' },
  ];

  return (
    <div className="learn-recycling">
      <Navbar />
      <section className="learn-recycling-section">
        <h1>Practice Recycling</h1>
        <p>Learn how to manage recyclable waste effectively.</p>
        <div className="steps">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <img src={step.image} alt={step.title}  height={400} width={700} className="step-image" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        <Link to="/learn/recyclable/quiz" className="quiz-button">
          Take Quiz
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default Recyclable;