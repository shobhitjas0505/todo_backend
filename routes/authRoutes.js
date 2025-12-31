// routes/authRoutes.js
// Authentication routes: register and login.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @body    { name, email, password }
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user and return a JWT token
 * @body    { email, password }
 * @access  Public
 */
router.post('/login', authController.login);

module.exports = router;