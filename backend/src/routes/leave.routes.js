const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, approveLeave, rejectLeave } = require('../controllers/leave.controller');
const { validateApplyLeave, validateLeaveId } = require('../validators/leave.validator');
const handleValidationErrors = require('../validators/validation.middleware');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

/**
 * @route   POST /api/leaves/apply
 * @desc    Apply for leave (Employee only)
 * @access  Private (Employee)
 */
router.post(
  '/apply',
  authenticate, // Auth required
  authorize('employee'), // Only employees can access
  validateApplyLeave, // Validate input
  handleValidationErrors, // Handle validation errors
  applyLeave
);

/**
 * @route   GET /api/leaves/my-leaves
 * @desc    Get employee's own leave requests (Employee only)
 * @access  Private (Employee)
 */
router.get(
  '/my-leaves',
  authenticate, // Auth required
  authorize('employee'), // Only employees can access
  getMyLeaves
);

/**
 * @route   GET /api/leaves/all
 * @desc    Get all leave requests (Employer only)
 * @access  Private (Employer)
 */
router.get(
  '/all',
  authenticate, // Auth required
  authorize('employer'), // Only employers can access
  getAllLeaves
);

/**
 * @route   PATCH /api/leaves/:id/approve
 * @desc    Approve a leave request (Employer only)
 * @access  Private (Employer)
 */
router.patch(
  '/:id/approve',
  authenticate, // Auth required
  authorize('employer'), // Only employers can access
  validateLeaveId, // Validate leave ID
  handleValidationErrors, // Handle validation errors
  approveLeave
);

/**
 * @route   PATCH /api/leaves/:id/reject
 * @desc    Reject a leave request (Employer only)
 * @access  Private (Employer)
 */
router.patch(
  '/:id/reject',
  authenticate, // Auth required
  authorize('employer'), // Only employers can access
  validateLeaveId, // Validate leave ID
  handleValidationErrors, // Handle validation errors
  rejectLeave
);

module.exports = router;
