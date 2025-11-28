const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  propertyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  checkOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
    defaultValue: 'Pending',
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  timestamps: true,
});

module.exports = Booking;