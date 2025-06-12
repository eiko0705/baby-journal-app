import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import upload from './s3-upload.js';

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

    const formattedAchievements = result.rows.map(achievement => {
      return {
        id: achievement.id,
        date: achievement.date,
        title: achievement.title,
        description: achievement.description,
        ageAtEvent: (achievement.age_years !== null && achievement.age_months !== null && achievement.age_days !== null) ? {
          years: achievement.age_years,
          months: achievement.age_months,
          days: achievement.age_days,
        } : null,
        tags: achievement.tags || [],
        photo: achievement.photo_url,
        createdAt: achievement.created_at,
        updatedAt: achievement.updated_at,
      }
    });
    res.status(200).json(formattedAchievements);
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
    const achievement = result.rows[0];
    const formattedAchievement = {
      id: achievement.id,
      date: achievement.date,
      title: achievement.title,
      description: achievement.description,
      ageAtEvent: (achievement.age_years !== null && achievement.age_months !== null && achievement.age_days !== null) ? {
        years: achievement.age_years,
        months: achievement.age_months,
        days: achievement.age_days,
      } : null,
      tags: achievement.tags || [],
      photo: achievement.photo_url,
      createdAt: achievement.created_at,
      updatedAt: achievement.updated_at,
    };
    res.status(201).json(formattedAchievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Internal server error while creating achievement' });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Achievement ID is required' });
  }

  try {
    const queryText = 'DELETE FROM achievements WHERE id = $1 RETURNING id';
    const values = [id];

    const result = await pool.query(queryText, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.status(200).json({ message: 'Achievement deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error(`Error deleting achievement with id ${id}:`, error);
    res.status(500).json({ error: 'Internal server error while deleting achievement' });
  }
})

app.put('/api/achievements/:id', async (req, res) => {
  const { id } = req.params;
  const { date, title, description, ageAtEvent, tags, photoUrl } = req.body;

  if (!date || !title) {
    return res.status(400).json({ error: 'Date and title are required' });
  }
  if (ageAtEvent === undefined || ageAtEvent === null || 
    typeof ageAtEvent.years !== 'number' ||
    typeof ageAtEvent.months !== 'number' ||
    typeof ageAtEvent.days !== 'number') {
    return res.status(400).json({ error: 'Valid ageAtEvent (with years, months, and days) is required' });
  }

  try {
    const queryText = `
      UPDATE achievements
      SET date = $1,
          title = $2,
          description = $3,
          age_years = $4,
          age_months = $5,
          age_days = $6,
          tags = $7,
          photo_url = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *;
    `;
    const values = [
      date,
      title,
      description || null,
      ageAtEvent.years,
      ageAtEvent.months,
      ageAtEvent.days,
      tags || [],
      photoUrl || null,
      id,
    ];

    const result = await pool.query(queryText, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const achievement = result.rows[0];
    const formattedAchievement = {
      id: achievement.id,
      date: achievement.date,
      title: achievement.title,
      description: achievement.description,
      ageAtEvent: (achievement.age_years !== null && achievement.age_months !== null && achievement.age_days !== null) ? {
        years: achievement.age_years,
        months: achievement.age_months,
        days: achievement.age_days,
      } : null,
      tags: achievement.tags || [],
      photo: achievement.photo_url,
      createdAt: achievement.created_at,
      updatedAt: achievement.updated_at,
    };

    res.status(200).json(formattedAchievement);
  } catch (error) {
    console.error(`Error updating achievement with id ${id}:`, error);
    res.status(500).json({ error: 'Internal server error while updating achievement' });
  }
});

app.post('/api/achievements/:id/photo', upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const photoUrl = req.file.location;
  try {
    const queryText = `
      UPDATE achievements
      SET photo_url = $1,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const values = [photoUrl, id];
    const result = await pool.query(queryText, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    const achievement = result.rows[0];
    const formattedAchievement = {
      id: achievement.id,
      date: achievement.date,
      title: achievement.title,
      description: achievement.description,
      ageAtEvent: (achievement.age_years !== null && achievement.age_months !== null && achievement.age_days !== null) ? {
        years: achievement.age_years,
        months: achievement.age_months,
        days: achievement.age_days,
      } : null,
      tags: achievement.tags || [],
      photo: achievement.photo_url,
      createdAt: achievement.created_at,
      updatedAt: achievement.updated_at,
    };
    res.status(200).json(formattedAchievement);
  } catch (error) {
    console.error(`Error updating photo for achievement with id ${id}:`, error);
    res.status(500).json({ error: 'Internal server error while updating photo' });
  }
});
  
app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}`);
});
