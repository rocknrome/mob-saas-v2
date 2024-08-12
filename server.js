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

app.use(express.json()); // Middleware to parse JSON bodies

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

// Route to get a client by ID
app.get('/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).send('Client not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to retrieve client');
    }
  });

// Route to create a new client
app.post('/clients', async (req, res) => {
  const { last_name, first_name, street_address, city, state, zip } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO clients (last_name, first_name, street_address, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [last_name, first_name, street_address, city, state, zip]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).send('Failed to create client');
  }
});

// Route to update a client
app.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { last_name, first_name, street_address, city, state, zip } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE clients SET last_name = $1, first_name = $2, street_address = $3, city = $4, state = $5, zip = $6 WHERE id = $7 RETURNING *',
      [last_name, first_name, street_address, city, state, zip, id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Client not found');
    }
  } catch (err) {
    console.error(err);
    res.status(400).send('Failed to update client');
  }
});

// Route to delete a client
app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'DELETE FROM clients WHERE id = $1 RETURNING *',
      [id]
    );
    if (rows.length > 0) {
      res.send('Client deleted successfully');
    } else {
      res.status(404).send('Client not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete client');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  
