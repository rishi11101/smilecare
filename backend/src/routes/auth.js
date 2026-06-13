const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid email or password format.' });
  }

  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/setup — create first admin (run once)
router.post('/setup', async (req, res) => {
  try {
    const existing = await db.query('SELECT id FROM admins LIMIT 1');
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Admin already exists. Use /login.' });
    }

    const email = process.env.ADMIN_EMAIL || 'admin@smilecare.in';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hash = await bcrypt.hash(password, 12);

    await db.query(
      'INSERT INTO admins (email, password_hash, name) VALUES ($1, $2, $3)',
      [email, hash, 'Dr. Admin']
    );

    res.json({ message: `Admin created. Email: ${email}` });
  } catch (err) {
    console.error('Setup error:', err);
    res.status(500).json({ error: 'Setup failed.' });
  }
});

// GET /api/auth/me — verify token
router.get('/me', authMiddleware, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
