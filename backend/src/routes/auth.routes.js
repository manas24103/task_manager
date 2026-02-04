const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

// Register new user
router.post('/register', validateRegister, AuthController.register);

// Login user
router.post('/login', validateLogin, AuthController.login);

// Refresh token
router.post('/refresh', AuthController.refreshToken);

// Logout user
router.post('/logout', authenticateToken, AuthController.logout);

// Change password
router.post('/change-password', authenticateToken, AuthController.changePassword);

// Forgot password
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router;
