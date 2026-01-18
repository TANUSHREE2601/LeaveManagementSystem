/**
 * Global error handling middleware
 * Provides centralized error handling with meaningful HTTP status codes
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (more detailed in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    console.error('❌ Error:', err.message);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid resource ID format: ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different value.`;
    error = { message, statusCode: 409 }; // 409 Conflict
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Validation Error: ${errors.join(', ')}`;
    error = { message, statusCode: 400, errors }; // Include errors array
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authentication token. Please log in again.';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your session has expired. Please log in again.';
    error = { message, statusCode: 401 };
  }

  // MongoDB connection errors
  if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError') {
    const message = 'Database connection error. Please try again later.';
    error = { message, statusCode: 503 }; // 503 Service Unavailable
  }

  // Rate limit errors
  if (err.statusCode === 429) {
    const message = 'Too many requests. Please try again later.';
    error = { message, statusCode: 429 }; // 429 Too Many Requests
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Prepare error response
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.name,
    }),
    ...(error.errors && { errors: error.errors }),
  };

  // Don't leak error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    errorResponse.message = 'An unexpected error occurred. Please try again later.';
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
