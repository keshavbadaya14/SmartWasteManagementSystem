import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Recyclable.css';

const ReduceWaste = () => {
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
      title: 'Plan Your Meals',
      description: 'Plan weekly meals to buy only what you need, reducing food waste.',
      image: `/images/reduce_step1.jpg`
    },
    {
      title: 'Shop Smart',
      description: 'Create a shopping list and stick to it to avoid impulse purchases.',
      image: `/images/reduce_step2.jpg`
    },
    {
      title: 'Buy in Bulk',
      description: 'Purchase non-perishable items in bulk to reduce packaging waste.',
      image: `/images/reduce_step3.jpg`
    },
    {
      title: 'Use Reusable Bags',
      description: 'Carry reusable bags for shopping to eliminate single-use plastic bags.',
      image: `/images/reduce_step4.jpg`
    },
    {
      title: 'Choose Minimal Packaging',
      description: 'Select products with minimal or recyclable packaging to reduce waste.',
      image: `/images/reduce_step5.jpg`
    },
    {
      title: 'Store Food Properly',
      description: 'Store food in airtight containers to extend shelf life and prevent spoilage.',
      image: `/images/reduce_step6.jpg`
    },
    {
      title: 'Avoid Disposable Items',
      description: 'Use reusable plates, cutlery, and cups instead of disposable ones.',
      image: `/images/reduce_step7.jpg`
    },
    {
      title: 'Repair Before Replacing',
      description: 'Fix broken items like clothing or electronics instead of discarding them.',
      image: `/images/reduce_step8.jpg`
    },
    {
      title: 'Compost Food Scraps',
      description: 'Compost unavoidable food scraps to divert waste from landfills.',
      image: `/images/reduce_step9.jpg`
    },
    {
      title: 'Say No to Junk Mail',
      description: 'Opt out of junk mail and catalogs to reduce paper waste.',
      image: `/images/reduce_step10.jpg`
    },
    {
      title: 'Use Digital Alternatives',
      description: 'Switch to e-tickets, e-bills, and digital subscriptions to cut paper use.',
      image: `/images/reduce_step11.jpg`
    },
    {
      title: 'Donate Unused Items',
      description: 'Donate clothes, furniture, or other items to prevent unnecessary waste.',
      image: `/images/reduce_step12.jpg`
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
        <Link to="/learn/reducewaste/quiz" className="quiz-button">
          Take Quiz
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default ReduceWaste;