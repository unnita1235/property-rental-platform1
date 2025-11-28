const express = require('express');
const {
  requestBooking,
  approveBooking,
  rejectBooking,
  getBookings,
  getPropertyBookings,
} = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.post('/', authMiddleware, roleMiddleware(['Customer']), requestBooking);
router.get('/customer/list', authMiddleware, roleMiddleware(['Customer']), getBookings);

// Owner routes
router.patch('/:id/approve', authMiddleware, roleMiddleware(['Owner']), approveBooking);
router.patch('/:id/reject', authMiddleware, roleMiddleware(['Owner']), rejectBooking);
router.get('/owner/list', authMiddleware, roleMiddleware(['Owner']), getPropertyBookings);

module.exports = router;
