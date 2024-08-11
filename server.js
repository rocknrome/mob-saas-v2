import pkg from 'pg';
const { Pool } = pkg;
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure your database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.send(`Database time: ${rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to connect to the database');
  }
});

// Route to get all clients
app.get('/clients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to retrieve clients');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
