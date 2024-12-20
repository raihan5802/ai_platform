const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const pool = require('./db');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Protected dashboard route
app.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // req.user.userId is available from the token
    const userRes = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.user.userId]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    const user = userRes.rows[0];
    res.status(200).json({ message: 'Welcome to your dashboard', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend server running on port ${port}`));
