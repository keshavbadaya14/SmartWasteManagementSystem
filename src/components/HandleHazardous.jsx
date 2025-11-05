import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Recyclable.css';

const HandleHazardous = () => {
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
    {title: 'Identify Hazardous Waste', description: 'Recognize items like batteries, chemicals, and electronics as hazardous.', image: `/images/hazardous_step1.jpg` },
    {title: 'Read Labels', description: 'Check product labels for warnings like "toxic" or "flammable".', image: `/images/hazardous_step2.jpg` },
    {title: 'Store Safely', description: 'Keep hazardous items in original containers, away from heat or children.', image: `/images/hazardous_step3.jpg` },
    {title: 'Avoid Mixing', description: 'Do not mix chemicals to prevent dangerous reactions.', image: `/images/hazardous_step4.jpg` },
    {title: 'Use Protective Gear', description: 'Wear gloves and masks when handling hazardous materials.', image: `/images/hazardous_step5.jpg` },
    {title: 'Find Collection Sites', description: 'Locate local hazardous waste drop-off centers or events.', image: `/images/hazardous_step6.jpg` },
    {title: 'Transport Safely', description: 'Use sealed containers and avoid spills during transport.', image: `/images/hazardous_step7.jpg` },
    {title: 'Follow Regulations', description: 'Adhere to local laws for hazardous waste disposal.', image: `/images/hazardous_step8.jpg` },
    {title: 'Recycle When Possible', description: 'Recycle batteries or electronics at designated facilities.', image: `/images/hazardous_step9.jpg` },
    {title: 'Educate Others', description: 'Share knowledge on safe hazardous waste disposal with your community.', image: `/images/hazardous_step10.jpg` },
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
        <Link to="/learn/hazardous/quiz" className="quiz-button">
          Take Quiz
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default HandleHazardous;