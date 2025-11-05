import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/LearnRecycling.css';

const EwasteManagementQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
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

  const questions = [
    {
      id: 'q1',
      question: 'What is the first step in managing e-waste?',
      type: 'single',
      options: ['Identify e-waste', 'Throw in trash', 'Burn electronics'],
      answer: 'Identify e-waste',
      explanation: 'Identifying electronics like phones or computers as e-waste is the first step for proper management.',
    },
    {
      id: 'q2',
      question: 'Which items are considered e-waste?',
      type: 'multiple',
      options: ['Computers', 'Paper', 'Batteries', 'Televisions'],
      answer: ['Computers', 'Batteries', 'Televisions'],
      explanation: 'Computers, batteries, and televisions are e-waste; paper is not.',
    },
    {
      id: 'q3',
      question: 'What should you do before recycling electronics?',
      type: 'single',
      options: ['Erase personal data', 'Break them apart', 'Mix with other waste'],
      answer: 'Erase personal data',
      explanation: 'Erasing personal data protects your privacy before recycling electronics.',
    },
    {
      id: 'q4',
      question: 'Where should e-waste be disposed of?',
      type: 'single',
      options: ['Regular trash bin', 'Certified recycling facility', 'Compost bin'],
      answer: 'Certified recycling facility',
      explanation: 'E-waste must be taken to certified recyclers to ensure safe disposal.',
    },
    {
      id: 'q5',
      question: 'Which actions are part of responsible e-waste management?',
      type: 'multiple',
      options: ['Using manufacturer take-back programs', 'Dumping in landfills', 'Removing batteries', 'Educating others'],
      answer: ['Using manufacturer take-back programs', 'Removing batteries', 'Educating others'],
      explanation: 'Manufacturer programs, removing batteries, and educating others promote responsible e-waste management; landfills are harmful.',
    },
  ];

  
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      // Store quiz results
      await axios.post(
        'http://localhost:5000/api/learn/quiz',
        { lessonId: 'ewaste_quiz', answers },
        { withCredentials: true, timeout: 5000 }
      );
      console.log('Quiz results stored');

      // Mark quiz as completed
      await axios.post(
        'http://localhost:5000/api/learn/progress',
        { lessonId: 'ewaste_quiz', completed: true },
        { withCredentials: true, timeout: 5000 }
      );
      console.log('Quiz completed');
    } catch (err) {
      console.error('Submit failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="learn-recycling">
      <Navbar />
      <section className="learn-recycling-section" style={{ backgroundColor: '#fff', border: '2px solid #4caf50', padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
        <h1 style={{ color: '#2e7d32', textAlign: 'center' }}>Recyclable Waste Quiz</h1>
        <p style={{ color: '#4caf50', textAlign: 'center' }}>Test your knowledge on recycling!</p>
        {!submitted ? (
          <div className="quiz">
            {questions.map(q => (
              <div key={q.id} className="question" style={{ border: '1px solid #4caf50', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                <p>{q.question}</p>
                {q.type === 'single' ? (
                  q.options.map(opt => (
                    <label key={opt} style={{ display: 'block', margin: '5px' }}>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleAnswer(q.id, opt)}
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  ))
                ) : (
                  q.options.map(opt => (
                    <label key={opt} style={{ display: 'block', margin: '5px' }}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                        onChange={() => {
                          const current = answers[q.id] || [];
                          const updated = current.includes(opt)
                            ? current.filter(item => item !== opt)
                            : [...current, opt];
                          handleAnswer(q.id, updated);
                        }}
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  ))
                )}
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              style={{
                backgroundColor: Object.keys(answers).length < questions.length ? '#ccc' : '#4caf50',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                marginTop: '20px',
                cursor: Object.keys(answers).length < questions.length ? 'not-allowed' : 'pointer',
              }}
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <div className="review">
            <h2 style={{ color: '#2e7d32' }}>Quiz Review</h2>
            {questions.map(q => {
              const userAnswer = answers[q.id];
              const isCorrect = q.type === 'single'
                ? userAnswer === q.answer
                : Array.isArray(userAnswer) && Array.isArray(q.answer) &&
                  userAnswer.length === q.answer.length &&
                  userAnswer.every(val => q.answer.includes(val));
              return (
                <div key={q.id} style={{ border: '1px solid #4caf50', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                  <p><strong>Question:</strong> {q.question}</p>
                  <p><strong>Your Answer:</strong> {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}</p>
                  <p><strong>Correct Answer:</strong> {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p>
                  <p><strong>Explanation:</strong> {q.explanation}</p>
                  <p style={{ color: isCorrect ? '#2e7d32' : '#d32f2f' }}>{isCorrect ? 'Correct' : 'Incorrect'}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default EwasteManagementQuiz;