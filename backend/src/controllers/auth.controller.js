const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * User Signup
 * Supports both employee and employer roles
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Validate role
    if (role && !['employee', 'employer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be either "employee" or "employer"',
      });
    }

    // Create user (password will be hashed by pre-save hook in User model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee', // Default to employee if not specified
    });

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Prepare user data (password is already excluded by toJSON method)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors,
      });
    }

    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    next(error);
  }
};

/**
 * User Login
 * Works for both employee and employer roles
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password using model method
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Prepare user data (password is already excluded by toJSON method)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
