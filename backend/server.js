import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS currentTIme');
    client.release();
    res.status(200).json({
      status: 'UP',
      postgres: 'Connected',
      time: result.rows[0].currenttime,
    })
  } catch (error) {
    console.error('Health check failed with DB error', error);
    res.status(500).json({
      status: 'DOWN',
      postgres: 'Connection Error',
      error: error.message,
    });
  }
});

app.get('/api/achievements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM achievements ORDER BY date DESC, created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error while fetching achievements' });
  }
});

app.post('/api/achievements', async (req, res) => {
  const { date, title, description, ageAtEvent, tags, photoUrl } = req.body;

  if (!date || !title) {
    return res.status(400).json({ error: 'Date and title are required' });
  }

  if (ageAtEvent === undefined || ageAtEvent === null) {
    return res.status(400).json({ error: 'Age at event is required' });
  }

  const newId = nanoid();

  try {
    const queryText = `
      INSERT INTO achievements (id, date, title, description, age_years, age_months, age_days, tags, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      newId,
      date,
      title, 
      description,
      ageAtEvent.years,
      ageAtEvent.months,
      ageAtEvent.days,
      tags,
      photoUrl,
    ];

    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Internal server error while creating achievement' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}`);
});
