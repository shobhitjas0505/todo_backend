// server.js
// Entry point for the backend application. Loads environment variables,
// connects to the database, registers middleware and routes, and starts the server.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file (if present)
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Built-in middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Health check / simple root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the To-Do Backend. Visit /api for APIs.' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});