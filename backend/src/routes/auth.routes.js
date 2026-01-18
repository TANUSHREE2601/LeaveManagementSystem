const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');
const { validateSignup, validateLogin } = require('../validators/auth.validator');
const handleValidationErrors = require('../validators/validation.middleware');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user (employee or employer)
 * @access  Public
 */
router.post(
  '/signup',
  validateSignup,
  handleValidationErrors,
  signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (employee or employer)
 * @access  Public
 */
router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  login
);

module.exports = router;
