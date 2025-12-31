// controllers/authController.js
// Handles user registration and login logic.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * - Validate input
 * - Hash the password
 * - Save the user to the database
 * - Return a success message
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body, "shobhit_1")
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Respond with success (do not send password back)
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Register error:', error);
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already in use.', message: error.message });
    }
    return res.status(500).json({ error: 'Server error during registration.', message: error.message });
  }
};

/**
 * Login a user
 * - Validate input
 * - Verify email and password
 * - Generate a JWT token
 * - Return the token and basic user info
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether email exists for security in real apps.
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Create JWT payload - include minimal user info
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_here', {
      expiresIn: '7d' // token valid for 7 days
    });

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};