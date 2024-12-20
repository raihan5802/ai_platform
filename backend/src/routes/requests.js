// src/routes/requests.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /requests - returns all requests for the logged-in client
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Fetch all requests for this client
    const requestsQuery = `
      SELECT r.id, r.description, r.special_requirements, r.delivery_type, r.status, 
             r.reason_for_rejection, r.estimated_delivery_date,
             p.status as project_status, p.completion_percentage
      FROM requests r
      LEFT JOIN projects p ON p.request_id = r.id
      WHERE r.client_id = $1
      ORDER BY r.created_at DESC;
    `;

    const requestsRes = await pool.query(requestsQuery, [userId]);
    res.json({ requests: requestsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /requests - create a new request by the logged-in client
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { description, special_requirements, delivery_type } = req.body;
    // Validate delivery_type
    if (!['Regular', 'Express'].includes(delivery_type)) {
      return res.status(400).json({ error: 'Invalid delivery_type. Must be Regular or Express.' });
    }

    // Insert the new request with status 'Pending'
    const insertQuery = `
      INSERT INTO requests (client_id, description, special_requirements, delivery_type, status)
      VALUES ($1, $2, $3, $4, 'Pending')
      RETURNING id, description, special_requirements, delivery_type, status, reason_for_rejection, estimated_delivery_date;
    `;
    const insertRes = await pool.query(insertQuery, [userId, description, special_requirements, delivery_type]);

    res.status(201).json({ message: 'Request created successfully', request: insertRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
