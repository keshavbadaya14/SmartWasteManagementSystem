import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());

app.use(express.json());

// Authentication middleware
const authenticateUser = async (req) => {
  try {
    console.log('Cookies received:', req.headers.cookie);
    const response = await axios.get('http://localhost:5003/profile', {
      headers: { Cookie: req.headers.cookie || '' },
      withCredentials: true,
      timeout: 5000
    });
    console.log('Auth server response:', response.data);
    return response.data.user?.id;
  } catch (err) {
    console.error('Auth error:', err.response?.data || err.message);
    return null;
  }
};

function classifyWaste(itemName, description) {
  const recyclableKeywords = ['plastic', 'paper', 'cardboard', 'glass', 'metal', 'bottle', 'can'];
  const organicKeywords = ['food', 'vegetable', 'fruit', 'compost', 'organic', 'peel', 'peal', 'leftover', 'kitchen', 'scrap', 'banana', 'apple', 'potato', 'vegetable peel'];
  const hazardousKeywords = ['battery', 'chemical', 'paint', 'electronics'];

  const text = `${itemName} ${description || ''}`.toLowerCase();

  if (recyclableKeywords.some(keyword => text.includes(keyword))) {
    return 'Recyclable';
  } else if (organicKeywords.some(keyword => text.includes(keyword))) {
    return 'Organic';
  } else if (hazardousKeywords.some(keyword => text.includes(keyword))) {
    return 'Hazardous';
  } else {
    return 'General Waste';
  }
}

app.post('/api/sort', async (req, res) => {

  const user_id = await authenticateUser(req);

  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { itemName, description } = req.body;

  if (!itemName) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  try {
    try {
      const response = await axios.post('http://localhost:5001/predict', {
        itemName,
        description
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { category, message } = response.data;

      const query = `
        INSERT INTO waste_logs (item_name, description, category, timestamp)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [itemName, description || null, category, new Date().toISOString()];
      const { rows } = await pool.query(query, values);

      return res.json({ category, message });
    } catch (modelError) {
      console.error('Model server error:', modelError.message);
      const category = classifyWaste(itemName, description);
      const message = `Item classified as ${category}`;

      const query = `
        INSERT INTO waste_logs (item_name, description, category, timestamp)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [itemName, description || null, category, new Date().toISOString()];
      const { rows } = await pool.query(query, values);

      return res.json({ category, message });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/learn/progress', async (req, res) => {
  const user_id = await authenticateUser(req);
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const query = 'SELECT lesson_id, completed FROM learning_progress WHERE user_id = $1';
    const { rows } = await pool.query(query, [user_id]);
    return res.json({ progress: rows });
  } catch (err) {
    console.error('Fetch progress error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/learn/progress', async (req, res) => {
  const user_id = await authenticateUser(req);
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { lessonId, completed } = req.body;
  console.log('Received body:', req.body);
  if (!lessonId || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid lessonId or completed status' });
  }

  try {
    const query = `
      INSERT INTO learning_progress (user_id, lesson_id, completed)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET completed = $3, timestamp = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [user_id, lessonId, completed];
    const { rows } = await pool.query(query, values);
    console.log('Updated learning_progress:', rows[0]);
    return res.json({ message: 'Progress updated', progress: rows[0] });
  } catch (err) {
    console.error('Update progress error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/learn/quiz', async (req, res) => {
  const user_id = await authenticateUser(req);
  console.log('Authenticated user:', user_id);
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { lessonId, answers } = req.body;
  if (!lessonId || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid lessonId or answers' });
  }

  try {
    const query = `
      INSERT INTO quiz_results (user_id, lesson_id, answers)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET answers = $3, timestamp = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [user_id, lessonId, JSON.stringify(answers)];
    const { rows } = await pool.query(query, values);
    console.log('Stored quiz_results:', rows[0]);
    return res.json({ message: 'Quiz results stored', result: rows[0] });
  } catch (err) {
    console.error('Store quiz results error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/learn/quiz', async (req, res) => {
  const user_id = await authenticateUser(req);
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { lessonId } = req.query;
  if (!lessonId) {
    return res.status(400).json({ error: 'Missing lessonId' });
  }

  try {
    const query = 'SELECT answers FROM quiz_results WHERE user_id = $1 AND lesson_id = $2';
    const { rows } = await pool.query(query, [user_id, lessonId]);
    if (rows.length === 0) {
      return res.json({ answers: null });
    }
    return res.json({ answers: JSON.parse(rows[0].answers) });
  } catch (err) {
    console.error('Fetch quiz results error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  }
});