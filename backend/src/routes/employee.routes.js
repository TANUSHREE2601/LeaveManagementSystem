const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/employee.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { ROLES } = require('../config/constants');

// All routes require authentication and employee role
router.use(authenticate);
router.use(authorize(ROLES.EMPLOYEE));

// Get Employee Profile
router.get('/profile', getProfile);

// Update Employee Profile
router.patch('/profile', updateProfile);

module.exports = router;
