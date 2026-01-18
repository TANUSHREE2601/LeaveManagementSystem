const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
    }));

    // Log validation errors for debugging
    console.error('❌ Validation Error:', {
      path: req.originalUrl,
      method: req.method,
      errors: formattedErrors,
      body: req.body,
    });

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = handleValidationErrors;
