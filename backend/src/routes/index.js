const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const leaveRoutes = require('./leave.routes');
const employerRoutes = require('./employer.routes');
const employeeRoutes = require('./employee.routes');

// Route definitions
router.use('/auth', authRoutes);
router.use('/leaves', leaveRoutes);
router.use('/employer', employerRoutes);
router.use('/employee', employeeRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
