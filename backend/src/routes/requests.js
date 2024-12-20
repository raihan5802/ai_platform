// routes/requests.js
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
    console.log('Incoming request body:', req.body); // Debugging log

    const userId = req.user.userId;
    const { description, special_requirements, delivery_type } = req.body;

    // Validate required fields
    if (!description || !delivery_type) {
      return res.status(400).json({ error: 'Description and delivery_type are required.' });
    }

    // Validate delivery_type
    if (!['Regular', 'Express'].includes(delivery_type)) {
      return res.status(400).json({ error: 'Invalid delivery_type. Must be Regular or Express.' });
    }

    // Insert the new request into the database
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

// DELETE /requests/:id - delete a specific request
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.userId;

    // Ensure the request belongs to the logged-in client
    const deleteQuery = `
      DELETE FROM requests 
      WHERE id = $1 AND client_id = $2
      RETURNING id;
    `;
    const deleteRes = await pool.query(deleteQuery, [requestId, userId]);

    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ error: 'Request not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /requests/:id - update a request's status or details
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.userId;
    const { description, special_requirements, delivery_type } = req.body;

    // Validate delivery_type if provided
    if (delivery_type && !['Regular', 'Express'].includes(delivery_type)) {
      return res.status(400).json({ error: 'Invalid delivery_type. Must be Regular or Express.' });
    }

    // Update the request
    const updateQuery = `
      UPDATE requests
      SET description = COALESCE($1, description),
          special_requirements = COALESCE($2, special_requirements),
          delivery_type = COALESCE($3, delivery_type),
          updated_at = NOW()
      WHERE id = $4 AND client_id = $5
      RETURNING id, description, special_requirements, delivery_type, status;
    `;
    const updateRes = await pool.query(updateQuery, [description, special_requirements, delivery_type, requestId, userId]);

    if (updateRes.rowCount === 0) {
      return res.status(404).json({ error: 'Request not found or not authorized to update.' });
    }

    res.status(200).json({ message: 'Request updated successfully', request: updateRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
