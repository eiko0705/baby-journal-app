require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

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

app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}`);
});
