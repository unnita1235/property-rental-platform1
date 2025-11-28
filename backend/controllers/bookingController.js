const { Booking, Property, Payment } = require('../models');
const { Op } = require('sequelize');

const requestBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate } = req.body;

    if (!propertyId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Calculate total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.pricePerNight;

    const booking = await Booking.create({
      propertyId,
      customerId: req.user.id,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Booking request created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.property.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Booking cannot be approved from current status' });
    }

    await booking.update({ status: 'Approved' });

    res.json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.property.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Booking cannot be rejected from current status' });
    }

    await booking.update({ status: 'Rejected' });

    res.json({ message: 'Booking rejected successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { customerId: req.user.id },
      include: [
        { model: Property, as: 'property' },
        { model: Payment, as: 'payment' },
      ],
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Property,
          as: 'property',
          where: { ownerId: req.user.id },
        },
        { model: Payment, as: 'payment' },
      ],
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestBooking,
  approveBooking,
  rejectBooking,
  getBookings,
  getPropertyBookings,
};