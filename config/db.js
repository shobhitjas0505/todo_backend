// config/db.js
// Database connection helper for MongoDB using Mongoose.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todo_app';
    await mongoose.connect(mongoUri, {
      // options are handled automatically in recent mongoose versions
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;