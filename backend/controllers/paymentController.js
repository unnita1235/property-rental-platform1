const { Payment, Booking } = require('../models');

const recordPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'Approved') {
      return res.status(400).json({ message: 'Can only pay for approved bookings' });
    }

    // Check if payment amount matches booking total (basic check)
    if (parseFloat(amount) < parseFloat(booking.totalPrice)) {
      return res.status(400).json({ message: 'Payment amount is less than the total price.' });
    }

    const payment = await Payment.create({
      bookingId,
      amount,
      paymentMethod,
      status: 'Completed',
    });

    // Update booking status to 'Completed' after successful payment
    await booking.update({ status: 'Completed' });

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    // Get payments associated with the logged-in customer's bookings
    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          as: 'booking',
          where: { customerId: req.user.id },
          attributes: ['id', 'propertyId', 'checkInDate', 'totalPrice'],
        },
      ],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordPayment, getPayments };
