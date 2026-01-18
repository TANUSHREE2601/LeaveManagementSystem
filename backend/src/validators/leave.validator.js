const { body, param } = require('express-validator');

/**
 * Apply Leave validation rules
 * Validates leaveType, startDate, endDate, and reason
 */
const validateApplyLeave = [
  body('leaveType')
    .trim()
    .notEmpty()
    .withMessage('Leave type is required')
    .isIn(['sick', 'casual', 'vacation', 'personal', 'maternity', 'paternity'])
    .withMessage('Invalid leave type. Must be one of: sick, casual, vacation, personal, maternity, paternity'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Please provide a valid start date (ISO 8601 format)')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Please provide a valid end date (ISO 8601 format)')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      
      if (endDate < startDate) {
        throw new Error('End date must be after or equal to start date');
      }
      return true;
    }),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
];

/**
 * Leave ID validation rules
 * Validates that the leave ID parameter is a valid MongoDB ObjectId
 */
const validateLeaveId = [
  param('id')
    .notEmpty()
    .withMessage('Leave ID is required')
    .isMongoId()
    .withMessage('Invalid leave ID format'),
];

module.exports = {
  validateApplyLeave,
  validateLeaveId,
};
