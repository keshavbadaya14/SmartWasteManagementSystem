import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Recyclable.css';

const ReuseItems = () => {
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
      title: 'Repurpose Containers',
      description: 'Use glass jars or plastic containers for storage or crafts instead of discarding them.',
      image: `/images/reuse_step1.jpg`
    },
    {
      title: 'Donate Clothes',
      description: 'Donate gently used clothes to charities or thrift stores to give them a new life.',
      image: `/images/reuse_step2.jpg`
    },
    {
      title: 'Upcycle Furniture',
      description: 'Refinish or repurpose old furniture, like painting a table or turning crates into shelves.',
      image: `/images/reuse_step3.jpg`
    },
    {
      title: 'Use Reusable Water Bottles',
      description: 'Switch to reusable water bottles instead of single-use plastic bottles.',
      image: `/images/reuse_step4.jpg`
    },
    {
      title: 'Repair Electronics',
      description: 'Fix broken electronics like phones or laptops at repair shops instead of replacing them.',
      image: `/images/reuse_step5.jpg`
    },
    {
      title: 'Share Tools',
      description: 'Borrow or lend tools with neighbors to avoid buying new ones.',
      image: `/images/reuse_step6.jpg`
    },
    {
      title: 'Use Cloth Napkins',
      description: 'Replace paper napkins with reusable cloth napkins for meals.',
      image: `/images/reuse_step7.jpg`
    },
    {
      title: 'Repurpose Scrap Paper',
      description: 'Use the back of printed paper for notes or crafts before recycling.',
      image: `/images/reuse_step8.jpg`
    },
    {
      title: 'Buy Secondhand',
      description: 'Purchase secondhand items like books or furniture from thrift stores or online marketplaces.',
      image: `/images/reuse_step9.jpg`
    },
    {
      title: 'Create DIY Projects',
      description: 'Turn old items like tires or pallets into garden planters or decor.',
      image: `/images/reuse_step10.jpg`
    },
    {
      title: 'Use Reusable Straws',
      description: 'Switch to metal or silicone straws instead of single-use plastic straws.',
      image: `/images/reuse_step11.jpg`
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
        <Link to="/learn/reuse/quiz" className="quiz-button">
          Take Quiz
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default ReuseItems;