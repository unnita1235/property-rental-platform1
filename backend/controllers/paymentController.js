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

    const payment = await Payment.create({
      bookingId,
      amount,
      paymentMethod,
      status: 'Completed',
    });

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
    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          as: 'booking',
          where: { customerId: req.user.id },
        },
      ],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordPayment, getPayments };