const express = require('express');
const { recordPayment, getPayments } = require('../controllers/paymentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Customer only routes
router.post('/', authMiddleware, roleMiddleware(['Customer']), recordPayment);
router.get('/', authMiddleware, roleMiddleware(['Customer']), getPayments);

module.exports = router;
