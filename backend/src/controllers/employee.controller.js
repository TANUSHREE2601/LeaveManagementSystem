const Employee = require('../models/Employee');

/**
 * Get Employee Profile
 */
const getProfile = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Employee Profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const employeeId = req.user.id;
    const { name, department } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Update allowed fields
    if (name) employee.name = name;
    if (department) employee.department = department;

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
