const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { sendConfirmationEmail } = require('../email');

const router = express.Router();

// POST /api/appointments — public (book appointment)
router.post('/', [
  body('patient_name').trim().notEmpty().withMessage('Name is required.'),
  body('patient_email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('patient_phone').trim().notEmpty().withMessage('Phone number is required.'),
  body('service_id').isInt().withMessage('Please select a service.'),
  body('appointment_date').isDate().withMessage('Valid date is required.'),
  body('appointment_time').matches(/^\d{2}:\d{2}$/).withMessage('Valid time is required.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { patient_name, patient_email, patient_phone, service_id, appointment_date, appointment_time, notes } = req.body;

  try {
    // Check if slot is still available (race condition guard)
    const conflictCheck = await db.query(
      "SELECT id FROM appointments WHERE appointment_date = $1 AND appointment_time = $2 AND status != 'cancelled'",
      [appointment_date, appointment_time]
    );
    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({ error: 'This slot was just booked. Please pick another time.' });
    }

    // Get service name
    const serviceResult = await db.query('SELECT name FROM services WHERE id = $1 AND is_active = true', [service_id]);
    if (!serviceResult.rows[0]) {
      return res.status(400).json({ error: 'Selected service is not available.' });
    }
    const service_name = serviceResult.rows[0].name;

    // Create appointment
    const result = await db.query(
      `INSERT INTO appointments (patient_name, patient_email, patient_phone, service_id, service_name, appointment_date, appointment_time, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [patient_name, patient_email, patient_phone, service_id, service_name, appointment_date, appointment_time, notes || null]
    );

    const appointment = result.rows[0];

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(appointment);

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: {
        id: appointment.id,
        patient_name: appointment.patient_name,
        service_name: appointment.service_name,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: appointment.status,
      }
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Booking failed. Please try again.' });
  }
});

// GET /api/appointments — admin only
router.get('/', authMiddleware, async (req, res) => {
  const { status, date, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];
  let paramIdx = 1;

  if (status && status !== 'all') {
    whereClause += ` AND status = $${paramIdx++}`;
    params.push(status);
  }
  if (date) {
    whereClause += ` AND appointment_date = $${paramIdx++}`;
    params.push(date);
  }

  try {
    const countResult = await db.query(
      `SELECT COUNT(*) FROM appointments ${whereClause}`, params
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(
      `SELECT * FROM appointments ${whereClause} ORDER BY appointment_date ASC, appointment_time ASC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    res.json({
      appointments: result.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// GET /api/appointments/stats — admin dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [total, todayCount, pending, confirmed] = await Promise.all([
      db.query('SELECT COUNT(*) FROM appointments'),
      db.query('SELECT COUNT(*) FROM appointments WHERE appointment_date = $1', [today]),
      db.query("SELECT COUNT(*) FROM appointments WHERE status = 'pending'"),
      db.query("SELECT COUNT(*) FROM appointments WHERE status = 'confirmed'"),
    ]);

    res.json({
      total: parseInt(total.rows[0].count),
      today: parseInt(todayCount.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      confirmed: parseInt(confirmed.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// PATCH /api/appointments/:id/status — admin only
router.patch('/:id/status', authMiddleware, [
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const result = await db.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [req.body.status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Appointment not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

module.exports = router;
