// Import and validate environment variables
const { validateEnv, PORT, NODE_ENV } = require('./config/env');

// Validate environment variables before starting server
validateEnv();

// Import app and database connection
const app = require('./app');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
