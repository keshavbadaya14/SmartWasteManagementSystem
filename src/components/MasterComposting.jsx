import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Recyclable.css';

const MasterComposting = () => {
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
    { title: 'Choose a Compost Bin', description: 'Select a suitable compost bin (e.g., tumbler, stationary) for indoor or outdoor use.', image: `/images/organic_step1.jpg` },
    { title: 'Pick a Location', description: 'Place the bin in a shaded, well-drained area with good air circulation.', image: `/images/organic_step2.jpg` },
    { title: 'Gather Materials', description: 'Collect green (nitrogen-rich) and brown (carbon-rich) materials like food scraps and dry leaves.', image: `/images/organic_step3.jpg` },
    { title: 'Balance the Mix', description: 'Maintain a 3:1 ratio of brown to green materials for optimal decomposition.', image: `/images/organic_step4.jpg` },
    { title: 'Chop Materials', description: 'Cut or shred materials into smaller pieces to speed up composting.', image: `/images/organic_step5.jpg` },
    { title: 'Add Layers', description: 'Layer green and brown materials alternately, starting with brown.', image: `/images/organic_step6.jpg` },
    { title: 'Keep It Moist', description: 'Ensure the compost is as wet as a wrung-out sponge.', image: `/images/organic_step7.jpg` },
    { title: 'Turn the Compost', description: 'Aerate by turning the compost every 1-2 weeks to promote decomposition.', image: `/images/organic_step8.jpg` },
    { title: 'Monitor Temperature', description: 'Check that the compost heats up (120-160°F) to ensure active decomposition.', image: `/images/organic_step9.jpg` },
    { title: 'Harvest Compost', description: 'Use mature compost (dark, crumbly) in gardens after 2-6 months.', image: `/images/organic_step10.jpg` },
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
        <Link to="/learn/organic/quiz" className="quiz-button">
          Take Quiz
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default MasterComposting;