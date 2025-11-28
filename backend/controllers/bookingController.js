const { Booking, Property, Payment } = require('../models');
const { Op } = require('sequelize'); // Imported for potential date conflict checking, though not used here

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
    // Simple night count calculation
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Check for invalid dates or negative nights
    if (nights <= 0 || checkIn.getTime() >= checkOut.getTime()) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }
    
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
    // Eager load the Property to check the ownerId
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
    // Eager load the Property to check the ownerId
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
    // Get bookings for the logged-in customer
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
    // Get bookings for properties owned by the logged-in owner
    const bookings = await Booking.findAll({
      include: [
        {
          model: Property,
          as: 'property',
          where: { ownerId: req.user.id }, // Filter by the owner's ID
          attributes: ['id', 'title', 'location', 'pricePerNight'], // Select only necessary property fields
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
