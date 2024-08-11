import express from 'express';
import dotenv from 'dotenv';
import clientsRoutes from './routes/clientRoutes.js';
import sequelize from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to MIB SaaS!');
});

// Routes for clients
app.use('/clients', clientsRoutes);

// Test the database connection before starting the server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
