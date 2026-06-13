const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/services — public
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

// GET /api/services/all — admin only (includes inactive)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

// POST /api/services — admin only
router.post('/', authMiddleware, [
  body('name').trim().notEmpty().withMessage('Service name is required.'),
  body('duration_minutes').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes.'),
  body('price').isInt({ min: 0 }).withMessage('Price must be a positive number.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, description, duration_minutes, price } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO services (name, description, duration_minutes, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || '', duration_minutes, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service.' });
  }
});

// PUT /api/services/:id — admin only
router.put('/:id', authMiddleware, [
  body('name').trim().notEmpty().withMessage('Service name is required.'),
  body('duration_minutes').isInt({ min: 15 }),
  body('price').isInt({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, description, duration_minutes, price, is_active } = req.body;

  try {
    const result = await db.query(
      'UPDATE services SET name=$1, description=$2, duration_minutes=$3, price=$4, is_active=$5 WHERE id=$6 RETURNING *',
      [name, description || '', duration_minutes, price, is_active !== false, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Service not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service.' });
  }
});

// DELETE /api/services/:id — admin only (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE services SET is_active = false WHERE id = $1', [req.params.id]);
    res.json({ message: 'Service deactivated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service.' });
  }
});

module.exports = router;
