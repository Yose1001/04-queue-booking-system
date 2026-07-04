const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require('../controllers/booking.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
