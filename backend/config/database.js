const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true } : false,
  },
});

module.exports = sequelize;