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

router.post('/', authMiddleware, roleMiddleware(['Customer']), requestBooking);
router.patch('/:id/approve', authMiddleware, roleMiddleware(['Owner']), approveBooking);
router.patch('/:id/reject', authMiddleware, roleMiddleware(['Owner']), rejectBooking);
router.get('/customer/list', authMiddleware, roleMiddleware(['Customer']), getBookings);
router.get('/owner/list', authMiddleware, roleMiddleware(['Owner']), getPropertyBookings);

module.exports = router;