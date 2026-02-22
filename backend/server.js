import express from 'express';
import cors from 'cors';
import { query, getClient } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const result = await query(`
      SELECT fs.session_id, fs.app_name, fs.planned_minutes, fs.ended_at, fs.end_reason,
             p.purpose_text, au.display_name
      FROM focus_session fs
      JOIN purpose p ON fs.purpose_id = p.purpose_id
      JOIN app_user au ON fs.user_id = au.user_id
      ORDER BY fs.session_id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/sessions/complete', async (req, res) => {
  try {
    const { app_name, purpose_text, planned_minutes, started_at, display_name = 'Guest User' } = req.body;
    if (!app_name || !purpose_text || planned_minutes == null || !started_at) {
      return res.status(400).json({ error: 'Missing required fields: app_name, purpose_text, planned_minutes, started_at' });
    }

    const client = await getClient();
    try {
      let userId;
      const userResult = await client.query(
        'SELECT user_id FROM app_user WHERE email = $1',
        ['guest@local.dev']
      );
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].user_id;
      } else {
        const insertUser = await client.query(
          'INSERT INTO app_user (email, display_name) VALUES ($1, $2) RETURNING user_id',
          ['guest@local.dev', display_name]
        );
        userId = insertUser.rows[0].user_id;
      }

      const purposeResult = await client.query(
        'INSERT INTO purpose (user_id, purpose_text) VALUES ($1, $2) RETURNING purpose_id',
        [userId, purpose_text]
      );
      const purposeId = purposeResult.rows[0].purpose_id;

      await client.query(
        `INSERT INTO focus_session (user_id, purpose_id, app_name, planned_minutes, started_at, ended_at, end_reason)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'completed')`,
        [userId, purposeId, app_name, planned_minutes, new Date(started_at).toISOString()]
      );

      res.status(201).json({ success: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error saving session:', err);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
