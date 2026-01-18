const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Authentication middleware - Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User not found',
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      userData: user,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Unauthorized. Invalid or expired token',
    });
  }
};

module.exports = authenticate;
