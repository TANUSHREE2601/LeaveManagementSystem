const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, DEPARTMENTS, DEFAULT_ANNUAL_LEAVES } = require('../config/constants');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: DEPARTMENTS,
        message: 'Invalid department',
      },
    },
    role: {
      type: String,
      default: ROLES.EMPLOYEE,
      enum: [ROLES.EMPLOYEE],
    },
    totalLeaves: {
      type: Number,
      default: DEFAULT_ANNUAL_LEAVES,
    },
    usedLeaves: {
      type: Number,
      default: 0,
    },
    remainingLeaves: {
      type: Number,
      default: DEFAULT_ANNUAL_LEAVES,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
//employeeSchema.index({ email: 1 });
//employeeSchema.index({ employeeId: 1 });
//employeeSchema.index({ email: 1, role: 1 });

// Hash password before saving
employeeSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Calculate remaining leaves before save
employeeSchema.pre('save', function (next) {
  this.remainingLeaves = this.totalLeaves - this.usedLeaves;
  next();
});

// Method to compare password
employeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to exclude password from JSON
employeeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Employee', employeeSchema);
