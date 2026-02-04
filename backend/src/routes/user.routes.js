const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticateToken, authorize } = require('../middlewares/auth.middleware');
const { validateRoleUpdate } = require('../validators/auth.validator');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

// Get all users (Admin only)
router.get('/', authenticateToken, authorize(['admin']), UserController.getAllUsers);

// Get current user profile
router.get('/profile', authenticateToken, UserController.getProfile);

// Get user by ID
router.get('/:id', authenticateToken, UserController.getUserById);

// Update user role (Admin only)
router.put('/:id/role', authenticateToken, authorize(['admin']), validateRoleUpdate, UserController.updateRole);

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorize(['admin']), UserController.deleteUser);

module.exports = router;
