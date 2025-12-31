// middleware/authMiddleware.js
// Protects routes by verifying JWT tokens and attaching user info to req.user.

const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes.
 * - Expects an Authorization header with the value: Bearer <token>
 * - Verifies the token and attaches the decoded payload to req.user
 * - If token is missing or invalid, responds with 401 Unauthorized
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Authorization denied.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided. Authorization denied.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');

    // Attach user info to request object for later handlers
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Token is not valid.' });
  }
};

module.exports = authMiddleware;