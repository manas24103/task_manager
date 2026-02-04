const User = require('../models/User.model');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, NODE_ENV, COOKIE_DOMAIN, COOKIE_SECURE, FRONTEND_URL } = require('../config/env');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    const err = new Error('Something went wrong while generating refresh and access token');
    err.statusCode = 500;
    throw err;
  }
};

class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fullName
   *               - username
   *               - email
   *               - password
   *             properties:
   *               fullName:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 50
   *               username:
   *                 type: string
   *                 minLength: 3
   *                 maxLength: 30
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: User already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async register(req, res, next) {
    try {
      const { fullName, username, email, password, role = 'user' } = req.body;
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;

      console.log(`👤 [${timestamp}] USER REGISTRATION ATTEMPT - IP: ${ip}`);
      console.log(`📧 [${timestamp}] Registration Email: ${email.toLowerCase()}`);
      console.log(`👔 [${timestamp}] Registration Role: ${role}`);
      console.log(`👤 [${timestamp}] Registration Username: ${username.toLowerCase()}`);

      if (!fullName || !username || !email || !password) {
        console.log(`❌ [${timestamp}] REGISTRATION FAILED - Missing fields - IP: ${ip}`);
        const error = new Error('All fields are required');
        error.statusCode = 400;
        throw error;
      }

      const existingUser = await User.findOne({
        email: email.toLowerCase()
      });

      if (existingUser) {
        console.log(`❌ [${timestamp}] REGISTRATION FAILED - Email already exists: ${email} - IP: ${ip}`);
        const error = new Error('User with this email already exists');
        error.statusCode = 409;
        throw error;
      }

      const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        role
      });

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      if (!createdUser) {
        console.log(`❌ [${timestamp}] REGISTRATION FAILED - User creation error - IP: ${ip}`);
        const error = new Error('Something went wrong while registering the user');
        error.statusCode = 500;
        throw error;
      }

      console.log(`✅ [${timestamp}] USER REGISTRATION SUCCESSFUL`);
      console.log(`🆔 [${timestamp}] New User ID: ${user._id}`);
      console.log(`👤 [${timestamp}] New Username: ${createdUser.username}`);
      console.log(`📧 [${timestamp}] New Email: ${createdUser.email}`);
      console.log(`👔 [${timestamp}] New Role: ${createdUser.role}`);
      console.log(`📅 [${timestamp}] Registration IP: ${ip}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: createdUser
      });
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] REGISTRATION ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log(`🔐 [${timestamp}] USER LOGIN ATTEMPT - IP: ${ip}`);
      console.log(`📧 [${timestamp}] Login Email: ${email.toLowerCase()}`);
      
      if (!email || !password) {
        console.log(`❌ [${timestamp}] LOGIN FAILED - Missing credentials - IP: ${ip}`);
        const error = new Error('Email and password are required');
        error.statusCode = 400;
        throw error;
      }
      
      const user = await User.findOne({
        email: email.toLowerCase()
      }).select("+password");

      if (!user) {
        console.log(`❌ [${timestamp}] LOGIN FAILED - User not found: ${email} - IP: ${ip}`);
        const error = new Error('User does not exist');
        error.statusCode = 404;
        throw error;
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        console.log(`❌ [${timestamp}] LOGIN FAILED - Invalid password for user: ${email} - IP: ${ip}`);
        const error = new Error('Invalid user credentials');
        error.statusCode = 401;
        throw error;
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

      const options = {
        httpOnly: true,
        secure: COOKIE_SECURE,
        domain: COOKIE_DOMAIN
      };

      console.log(`✅ [${timestamp}] USER LOGIN SUCCESSFUL`);
      console.log(`🆔 [${timestamp}] User ID: ${user._id}`);
      console.log(`👤 [${timestamp}] Username: ${loggedInUser.username}`);
      console.log(`📧 [${timestamp}] Email: ${loggedInUser.email}`);
      console.log(`👔 [${timestamp}] Role: ${loggedInUser.role}`);
      console.log(`📅 [${timestamp}] Login IP: ${ip}`);
      console.log(`🔑 [${timestamp}] Access Token Generated: ${accessToken.substring(0, 20)}...`);
      console.log(`🔄 [${timestamp}] Refresh Token Generated: ${refreshToken.substring(0, 20)}...`);

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
          message: 'User logged in successfully',
          data: {
            user: loggedInUser,
            accessToken,
            refreshToken
          }
        });
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] LOGIN ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  static async logout(req, res, next) {
    try {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log(`🚪 [${timestamp}] USER LOGOUT ATTEMPT - IP: ${ip}`);
      console.log(`🆔 [${timestamp}] Logout User ID: ${req.user._id}`);
      console.log(`👤 [${timestamp}] Logout Username: ${req.user.username}`);
      console.log(`👔 [${timestamp}] Logout User Role: ${req.user.role}`);

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $unset: {
            refreshToken: 1
          }
        },
        {
          new: true
        }
      );

      const options = {
        httpOnly: true,
        secure: COOKIE_SECURE,
        domain: COOKIE_DOMAIN
      };

      console.log(`✅ [${timestamp}] USER LOGOUT SUCCESSFUL`);
      console.log(`🧹 [${timestamp}] Refresh token cleared for user: ${req.user.username}`);
      console.log(`🍪 [${timestamp}] Cookies cleared - IP: ${ip}`);

      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
          success: true,
          message: 'User logged out successfully',
          data: {}
        });
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] LOGOUT ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       401:
   *         description: Invalid token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async refreshToken(req, res, next) {
    try {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!incomingRefreshToken) {
        const error = new Error('Refresh token is required');
        error.statusCode = 401;
        throw error;
      }

      const decodedToken = jwt.verify(
        incomingRefreshToken,
        REFRESH_TOKEN_SECRET
      );
      
      const user = await User.findById(decodedToken?._id);

      if (!user) {
        const error = new Error('Invalid refresh token');
        error.statusCode = 401;
        throw error;
      }

      if (incomingRefreshToken !== user.refreshToken) {
        const error = new Error('Refresh token is expired or used');
        error.statusCode = 401;
        throw error;
      }

      const options = {
        httpOnly: true,
        secure: COOKIE_SECURE,
        domain: COOKIE_DOMAIN
      };

      const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
      
      user.refreshToken = newRefreshToken;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
      
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
          success: true,
          message: 'Access token refreshed',
          data: {
            accessToken,
            refreshToken: newRefreshToken
          }
        });
    } catch (error) {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      next(err);
    }
  }

  /**
   * @swagger
   * /auth/change-password:
   *   post:
   *     summary: Change current password
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - oldPassword
   *               - newPassword
   *             properties:
   *               oldPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        const error = new Error('Old password and new password are required');
        error.statusCode = 400;
        throw error;
      }

      if (oldPassword === newPassword) {
        const error = new Error('New password must be different from old password');
        error.statusCode = 400;
        throw error;
      }

      const user = await User.findById(req.user._id).select("+password");
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      const isPasswordCorrect = await user.comparePassword(oldPassword);

      if (!isPasswordCorrect) {
        const error = new Error('Invalid old password');
        error.statusCode = 400;
        throw error;
      }

      user.password = newPassword;
      user.refreshToken = undefined;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please login again.',
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Forgot password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Password reset link sent
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      const resetToken = crypto.randomBytes(32).toString('hex');

      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
      
      // In a real application, you would send an email here
      // await sendPasswordResetEmail(user.email, resetUrl);
      console.log('Password reset link:', resetUrl);

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email. Please check your inbox.',
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
