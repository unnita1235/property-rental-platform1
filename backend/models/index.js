const sequelize = require('../config/db');
const User = require('./User');
const Property = require('./Property');
const Booking = require('./Booking');
const Payment = require('./Payment');

// Define associations
User.hasMany(Property, { foreignKey: 'ownerId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Booking, { foreignKey: 'customerId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

Property.hasMany(Booking, { foreignKey: 'propertyId', as: 'bookings' });
Booking.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

module.exports = { User, Property, Booking, Payment, sequelize };
