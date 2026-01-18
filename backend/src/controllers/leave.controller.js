const Leave = require('../models/Leave');

/**
 * Employee: Apply for leave
 */
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user.id;

    // Ensure user is an employee
    if (req.user.role !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only employees can apply for leave',
      });
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past',
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after or equal to start date',
      });
    }

    // Create leave request with default status 'Pending'
    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending', // Default status
    });

    // Populate employee details
    await leave.populate('employee', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave,
    });
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors,
      });
    }

    next(error);
  }
};

/**
 * Employee: Get my leaves
 */
const getMyLeaves = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    // Ensure user is an employee
    if (req.user.role !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only employees can view their leaves',
      });
    }

    // Optional query parameters for filtering
    const { status, page = 1, limit = 10 } = req.query;

    // Build query - only get leaves for this employee
    const query = { employee: employeeId };

    // Filter by status if provided
    if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get leaves with pagination
    const leaves = await Leave.find(query)
      .populate('employee', 'name email role')
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalLeaves = await Leave.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Leaves retrieved successfully',
      data: {
        leaves,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalLeaves / limitNum),
          totalLeaves,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Employer: Get dashboard statistics
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const total = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: 'Pending' });
    const approved = await Leave.countDocuments({ status: 'Approved' });
    const rejected = await Leave.countDocuments({ status: 'Rejected' });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Employer: Get all leave requests
 */
const getAllLeaves = async (req, res, next) => {
  try {
    // Ensure user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only employers can view all leaves',
      });
    }

    // Optional query parameters for filtering
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    // Filter by status if provided
    if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get leaves with pagination
    const leaves = await Leave.find(query)
      .populate('employee', 'name email role')
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalLeaves = await Leave.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Leaves retrieved successfully',
      data: {
        leaves,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalLeaves / limitNum),
          totalLeaves,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Employer: Approve leave
 */
const approveLeave = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only employers can approve leaves',
      });
    }

    // Find leave by ID - handle invalid ID gracefully
    let leave;
    try {
      leave = await Leave.findById(id).populate('employee', 'name email role');
    } catch (error) {
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid leave ID format',
        });
      }
      throw error;
    }

    // Check if leave exists
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    // Check if leave is already processed
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Leave request is already ${leave.status}. Cannot change status.`,
      });
    }

    // Update leave status to Approved
    leave.status = 'Approved';
    leave.updatedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Employer: Reject leave
 */
const rejectLeave = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ensure user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only employers can reject leaves',
      });
    }

    // Find leave by ID - handle invalid ID gracefully
    let leave;
    try {
      leave = await Leave.findById(id).populate('employee', 'name email role');
    } catch (error) {
      // Handle invalid ObjectId format
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid leave ID format',
        });
      }
      throw error;
    }

    // Check if leave exists
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    // Check if leave is already processed
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Leave request is already ${leave.status}. Cannot change status.`,
      });
    }

    // Update leave status to Rejected
    leave.status = 'Rejected';
    leave.updatedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully',
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getDashboardStats,
  getAllLeaves,
  approveLeave,
  rejectLeave,
};
