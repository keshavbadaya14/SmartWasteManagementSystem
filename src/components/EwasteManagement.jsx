import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Recyclable.css';

const EwasteManagement = () => {
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
    {
      title: 'Identify E-Waste',
      description: 'Recognize electronics like phones, computers, and appliances as e-waste.',
      image: `/images/ewaste_step1.jpg`
    },
    {
      title: 'Check for Reuse',
      description: 'Determine if electronics can be repaired or donated for reuse before disposal.',
      image: `/images/ewaste_step2.jpg`
    },
    {
      title: 'Back Up Data',
      description: 'Back up important data from devices before recycling or donating them.',
      image: `/images/ewaste_step3.jpg`
    },
    {
      title: 'Erase Personal Data',
      description: 'Wipe personal data from devices using secure software to protect privacy.',
      image: `/images/ewaste_step4.jpg`
    },
    {
      title: 'Find Certified Recyclers',
      description: 'Locate e-waste recycling facilities certified by organizations like e-Stewards or R2.',
      image: `/images/ewaste_step5.jpg`
    },
    {
      title: 'Remove Batteries',
      description: 'Remove batteries from electronics, as they require separate disposal.',
      image: `/images/ewaste_step6.jpg`
    },
    {
      title: 'Use Manufacturer Programs',
      description: 'Check if manufacturers offer take-back programs for their products.',
      image: `/images/ewaste_step7.jpg`
    },
    {
      title: 'Drop Off at Collection Sites',
      description: 'Take e-waste to designated collection sites or recycling events.',
      image: `/images/ewaste_step8.jpg`
    },
    {
      title: 'Avoid Landfills',
      description: 'Never dispose of e-waste in regular trash to prevent environmental harm.',
      image: `/images/ewaste_step9.jpg`
    },
    {
      title: 'Educate Others',
      description: 'Share e-waste recycling knowledge with friends and family to promote responsible disposal.',
      image: `/images/ewaste_step10.jpg`
    },
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
        <Link to="/learn/ewaste/quiz" className="quiz-button">
          Take Quiz
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default EwasteManagement;