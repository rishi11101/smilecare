const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Clinic working hours
const WORK_START = 9;   // 9 AM
const WORK_END = 19;    // 7 PM
const LUNCH_START = 13; // 1 PM
const LUNCH_END = 14;   // 2 PM
const SLOT_MINUTES = 30;

function generateSlots() {
  const slots = [];
  for (let h = WORK_START; h < WORK_END; h++) {
    if (h >= LUNCH_START && h < LUNCH_END) continue;
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

// GET /api/slots?date=2025-12-25
router.get('/', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required.' });

  // Validate date format
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ error: 'Invalid date format.' });
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj < today) {
    return res.status(400).json({ error: 'Cannot book past dates.' });
  }

  // Check if Sunday (0 = Sunday)
  if (dateObj.getDay() === 0) {
    return res.json({ slots: [], blocked: true, reason: 'Clinic is closed on Sundays.' });
  }

  try {
    // Check if date is blocked
    const blockedResult = await db.query(
      'SELECT reason FROM blocked_dates WHERE date = $1', [date]
    );
    if (blockedResult.rows.length > 0) {
      return res.json({
        slots: [],
        blocked: true,
        reason: blockedResult.rows[0].reason || 'Clinic closed on this date.'
      });
    }

    // Get booked slots for the date
    const bookedResult = await db.query(
      "SELECT appointment_time FROM appointments WHERE appointment_date = $1 AND status != 'cancelled'",
      [date]
    );
    const bookedTimes = bookedResult.rows.map(r => r.appointment_time.substring(0, 5));

    // Generate all slots and filter out booked ones
    const allSlots = generateSlots();
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();

    const availableSlots = allSlots.map(slot => {
      const [h, m] = slot.split(':').map(Number);
      let isPast = false;
      if (isToday) {
        const slotTime = new Date();
        slotTime.setHours(h, m, 0, 0);
        isPast = slotTime <= now;
      }
      return {
        time: slot,
        available: !bookedTimes.includes(slot) && !isPast,
      };
    });

    res.json({ slots: availableSlots, blocked: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch slots.' });
  }
});

// GET /api/slots/blocked — admin only
router.get('/blocked', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blocked_dates ORDER BY date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blocked dates.' });
  }
});

// POST /api/slots/block — admin only
router.post('/block', authMiddleware, async (req, res) => {
  const { date, reason } = req.body;
  if (!date) return res.status(400).json({ error: 'Date is required.' });

  try {
    const result = await db.query(
      'INSERT INTO blocked_dates (date, reason) VALUES ($1, $2) ON CONFLICT (date) DO UPDATE SET reason = $2 RETURNING *',
      [date, reason || 'Clinic closed']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to block date.' });
  }
});

// DELETE /api/slots/block/:date — admin only
router.delete('/block/:date', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM blocked_dates WHERE date = $1', [req.params.date]);
    res.json({ message: 'Date unblocked.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unblock date.' });
  }
});

module.exports = router;
