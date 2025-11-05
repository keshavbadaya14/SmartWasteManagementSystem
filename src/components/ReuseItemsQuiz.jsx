import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/LearnRecycling.css';

const ReuseItemsQuiz = () => {
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
      question: 'What can you do with old glass jars to reuse them?',
      type: 'single',
      options: ['Throw them away', 'Use for storage', 'Recycle immediately'],
      answer: 'Use for storage',
      explanation: 'Old glass jars can be reused for storage or crafts, extending their lifespan.',
    },
    {
      id: 'q2',
      question: 'Which items can be reused instead of discarded?',
      type: 'multiple',
      options: ['Clothes', 'Electronics', 'Plastic bags', 'Food scraps'],
      answer: ['Clothes', 'Electronics'],
      explanation: 'Clothes and electronics can be donated or repaired; plastic bags should be minimized, and food scraps composted.',
    },
    {
      id: 'q3',
      question: 'What is upcycling in the context of furniture?',
      type: 'single',
      options: ['Throwing it away', 'Repainting or repurposing', 'Buying new'],
      answer: 'Repainting or repurposing',
      explanation: 'Upcycling involves creatively transforming furniture, like painting a table, to extend its use.',
    },
    {
      id: 'q4',
      question: 'How can you reduce single-use plastic consumption?',
      type: 'single',
      options: ['Use disposable straws', 'Use reusable water bottles', 'Buy more plastic bottles'],
      answer: 'Use reusable water bottles',
      explanation: 'Reusable water bottles reduce the need for single-use plastics.',
    },
    {
      id: 'q5',
      question: 'Which actions promote item reuse?',
      type: 'multiple',
      options: ['Buying secondhand', 'Using cloth napkins', 'Throwing away paper', 'Sharing tools'],
      answer: ['Buying secondhand', 'Using cloth napkins', 'Sharing tools'],
      explanation: 'Buying secondhand, using cloth napkins, and sharing tools promote reuse; throwing away paper does not.',
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
        { lessonId: 'reuse_quiz', answers },
        { withCredentials: true, timeout: 5000 }
      );
      console.log('Quiz results stored');

      // Mark quiz as completed
      await axios.post(
        'http://localhost:5000/api/learn/progress',
        { lessonId: 'reuse_quiz', completed: true },
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

export default ReuseItemsQuiz;