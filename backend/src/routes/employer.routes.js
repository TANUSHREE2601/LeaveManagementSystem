const express = require('express');
const router = express.Router();
const {
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getDashboardStats,
} = require('../controllers/leave.controller');
const { validateLeaveId } = require('../validators/leave.validator');
const handleValidationErrors = require('../validators/validation.middleware');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// All routes require authentication and employer role
router.use(authenticate);
router.use(authorize(ROLES.EMPLOYER));

// Get Dashboard Statistics
router.get('/dashboard', getDashboardStats);

// Get All Leave Requests
router.get('/leaves', getAllLeaves);

// Approve Leave Request
router.patch(
  '/leaves/:id/approve',
  validateLeaveId,
  handleValidationErrors,
  approveLeave
);

// Reject Leave Request
router.patch(
  '/leaves/:id/reject',
  validateLeaveId,
  handleValidationErrors,
  rejectLeave
);

module.exports = router;
