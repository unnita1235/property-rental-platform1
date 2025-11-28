const express = require('express');
const cors = require('cors');
// Import sequelize configuration
const sequelize = require('./config/database'); 
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

// Connect to the DB and start the server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});
