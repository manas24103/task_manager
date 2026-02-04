const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response');

class UserController {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *       403:
   *         description: Admin access required
   */
  static async getAllUsers(req, res, next) {
    try {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log(`👥 [${timestamp}] ADMIN USER LIST REQUEST - IP: ${ip}`);
      console.log(`👑 [${timestamp}] Requesting Admin: ${req.user.username} (${req.user.role})`);
      
      const { limit = 20, offset = 0 } = req.query;
      console.log(`📊 [${timestamp}] Pagination - Limit: ${limit}, Offset: ${offset}`);
      
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));
      
      console.log(`✅ [${timestamp}] USERS LISTED SUCCESSFULLY`);
      console.log(`👥 [${timestamp}] Total users returned: ${users.length}`);
      
      res.json(successResponse('Users retrieved successfully', users));
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] USER LIST ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *       404:
   *         description: User not found
   */
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password_hash');
      
      if (!user) {
        return res.status(404).json(errorResponse('User not found'));
      }

      res.json(successResponse('User retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /users/{id}/role:
   *   put:
   *     summary: Update user role (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *     responses:
   *       200:
   *         description: User role updated successfully
   *       404:
   *         description: User not found
   *       403:
   *         description: Admin access required
   */
  static async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      const user = await User.findByIdAndUpdate(
        id, 
        { role }, 
        { new: true, runValidators: true }
      ).select('-password_hash');
      
      if (!user) {
        return res.status(404).json(errorResponse('User not found'));
      }

      res.json(successResponse('User role updated successfully', user));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Delete user (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   *       403:
   *         description: Admin access required
   */
  static async deleteUser(req, res, next) {
    try {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log(`🗑️ [${timestamp}] ADMIN USER DELETION ATTEMPT - IP: ${ip}`);
      console.log(`👑 [${timestamp}] Deleting Admin: ${req.user.username} (${req.user.role})`);
      
      const { id } = req.params;
      console.log(`🎯 [${timestamp}] Target User ID: ${id}`);
      
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        console.log(`❌ [${timestamp}] USER DELETION FAILED - User not found: ${id}`);
        return res.status(404).json(errorResponse('User not found'));
      }

      console.log(`✅ [${timestamp}] USER DELETED SUCCESSFULLY`);
      console.log(`🆔 [${timestamp}] Deleted User ID: ${user._id}`);
      console.log(`👤 [${timestamp}] Deleted Username: ${user.username}`);
      console.log(`📧 [${timestamp}] Deleted Email: ${user.email}`);
      console.log(`👔 [${timestamp}] Deleted Role: ${user.role}`);
      console.log(`📅 [${timestamp}] Account Created: ${user.createdAt}`);
      console.log(`🗑️ [${timestamp}] Deletion IP: ${ip}`);

      res.json(successResponse('User deleted successfully', { id: user._id }));
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] USER DELETION ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /users/profile:
   *   get:
   *     summary: Get current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profile retrieved successfully
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password_hash');
      res.json(successResponse('Profile retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
