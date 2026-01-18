module.exports = {
  // Roles
  ROLES: {
    EMPLOYEE: 'employee',
    EMPLOYER: 'employer',
  },

  // Leave Types
  LEAVE_TYPES: {
    SICK: 'sick',
    CASUAL: 'casual',
    VACATION: 'vacation',
    PERSONAL: 'personal',
    MATERNITY: 'maternity',
    PATERNITY: 'paternity',
  },

  // Leave Status
  LEAVE_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },

  // Departments
  DEPARTMENTS: [
    'Engineering',
    'HR',
    'Finance',
    'Sales',
    'Marketing',
    'Operations',
  ],

  // Default leave balance
  DEFAULT_ANNUAL_LEAVES: 25,

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
