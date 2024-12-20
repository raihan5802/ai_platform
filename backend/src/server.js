// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const requestsRoutes = require('./routes/requests');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL if different
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/requests', requestsRoutes);

// Protected dashboard route
app.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.user.userId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const user = userRes.rows[0];
    res.status(200).json({ message: 'Welcome to your dashboard', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend server running on port ${port}`));
