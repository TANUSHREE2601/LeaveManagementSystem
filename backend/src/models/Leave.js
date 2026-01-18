const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    leaveType: {
      type: String,
      required: [true, 'Leave type is required'],
      enum: {
        values: ['sick', 'casual', 'vacation', 'personal', 'maternity', 'paternity'],
        message: 'Invalid leave type. Must be one of: sick, casual, vacation, personal, maternity, paternity',
      },
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      validate: {
        validator: function (value) {
          // Allow dates from today onwards
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        },
        message: 'Start date cannot be in the past',
      },
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          // End date must be after or equal to start date
          return value >= this.startDate;
        },
        message: 'End date must be after or equal to start date',
      },
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: 'Status must be one of: Pending, Approved, Rejected',
      },
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for better query performance
leaveSchema.index({ employee: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ createdAt: -1 }); // Descending order for recent first
leaveSchema.index({ employee: 1, status: 1 }); // Compound index
leaveSchema.index({ status: 1, createdAt: -1 }); // Compound index for employer queries

// Pre-save validation: Ensure endDate is not before startDate
leaveSchema.pre('save', function (next) {
  if (this.endDate < this.startDate) {
    const error = new Error('End date must be after or equal to start date');
    return next(error);
  }
  next();
});

// Virtual field to calculate number of days (optional - for convenience)
leaveSchema.virtual('days').get(function () {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  }
  return 0;
});

// Ensure virtual fields are included in JSON output
leaveSchema.set('toJSON', { virtuals: true });
leaveSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Leave', leaveSchema);
