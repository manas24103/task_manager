const taskService = require('../services/task.service');
const { successResponse, errorResponse } = require('../utils/response');

class TaskController {
  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Get all tasks (Admin) or user's tasks (User)
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, in_progress, completed]
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [low, medium, high]
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
   *         description: Tasks retrieved successfully
   */
  static async getAllTasks(req, res, next) {
    try {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log(`📋 [${timestamp}] TASK FETCH ATTEMPT - IP: ${ip}`);
      console.log(`👤 [${timestamp}] Requesting User: ${req.user.username} (${req.user.role})`);
      console.log(`🔍 [${timestamp}] Query Filters:`, JSON.stringify(req.query, null, 2));

      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        limit: req.query.limit,
        offset: req.query.offset
      };

      // If user is not admin, only show their tasks
      if (req.user.role !== 'admin') {
        filters.user_id = req.user._id; // 🔥 Use _id instead of id (MongoDB ObjectId)
        console.log(`🔒 [${timestamp}] Non-admin user - filtering by user_id: ${req.user._id}`);
      } else {
        console.log(`👑 [${timestamp}] Admin user - fetching all tasks`);
      }

      const tasks = await taskService.getAllTasks(filters);
      
      console.log(`✅ [${timestamp}] TASKS FETCHED SUCCESSFULLY`);
      console.log(`📊 [${timestamp}] Total tasks returned: ${tasks.data?.length || 0}`);
      
      res.json(successResponse('Tasks retrieved successfully', tasks));
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] TASK FETCH ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /tasks/{id}:
   *   get:
   *     summary: Get task by ID
   *     tags: [Tasks]
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
   *         description: Task retrieved successfully
   *       404:
   *         description: Task not found
   *       403:
   *         description: Access denied
   */
  static async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id, req.user);
      
      if (!task) {
        return res.status(404).json(errorResponse('Task not found'));
      }

      res.json(successResponse('Task retrieved successfully', task));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 maxLength: 200
   *               description:
   *                 type: string
   *                 maxLength: 1000
   *               status:
   *                 type: string
   *                 enum: [pending, in_progress, completed]
   *                 default: pending
   *               priority:
   *                 type: string
   *                 enum: [low, medium, high]
   *                 default: medium
   *     responses:
   *       201:
   *         description: Task created successfully
   */
  static async createTask(req, res, next) {
    try {
      const timestamp = new Date().toISOString();
      const ip = req.ip || req.connection.remoteAddress;
      
      console.log(`➕ [${timestamp}] TASK CREATION ATTEMPT - IP: ${ip}`);
      console.log(`👤 [${timestamp}] Creating User: ${req.user.username} (${req.user.role})`);
      console.log(`📝 [${timestamp}] Task Data:`, JSON.stringify(req.body, null, 2));

      const taskData = {
        ...req.body,
        user_id: req.user._id // 🔥 Use _id instead of id (MongoDB ObjectId)
      };
      
      const task = await taskService.createTask(taskData);
      
      console.log(`✅ [${timestamp}] TASK CREATED SUCCESSFULLY`);
      console.log(`🆔 [${timestamp}] New Task ID: ${task.data?._id}`);
      console.log(`📋 [${timestamp}] Task Title: ${task.data?.title}`);
      console.log(`🎯 [${timestamp}] Task Status: ${task.data?.status}`);
      console.log(`⭐ [${timestamp}] Task Priority: ${task.data?.priority}`);
      console.log(`👤 [${timestamp}] Assigned to User ID: ${taskData.user_id}`);
      
      res.status(201).json(successResponse('Task created successfully', task));
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`💥 [${timestamp}] TASK CREATION ERROR: ${error.message} - IP: ${req.ip || req.connection.remoteAddress}`);
      next(error);
    }
  }

  /**
   * @swagger
   * /tasks/{id}:
   *   put:
   *     summary: Update task
   *     tags: [Tasks]
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
   *               title:
   *                 type: string
   *                 maxLength: 200
   *               description:
   *                 type: string
   *                 maxLength: 1000
   *               status:
   *                 type: string
   *                 enum: [pending, in_progress, completed]
   *               priority:
   *                 type: string
   *                 enum: [low, medium, high]
   *     responses:
   *       200:
   *         description: Task updated successfully
   *       404:
   *         description: Task not found
   *       403:
   *         description: Access denied
   */
  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.updateTask(id, req.body, req.user);
      
      if (!task) {
        return res.status(404).json(errorResponse('Task not found'));
      }
      
      res.json(successResponse('Task updated successfully', task));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Delete task
   *     tags: [Tasks]
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
   *         description: Task deleted successfully
   *       404:
   *         description: Task not found
   *       403:
   *         description: Access denied
   */
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.deleteTask(id, req.user);
      
      if (!task) {
        return res.status(404).json(errorResponse('Task not found'));
      }

      res.json(successResponse('Task deleted successfully', { id: task._id }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /tasks/stats:
   *   get:
   *     summary: Get task statistics
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Statistics retrieved successfully
   */
  static async getTaskStats(req, res, next) {
    try {
      const stats = await taskService.getTaskStats(req.user);
      res.json(successResponse('Task statistics retrieved successfully', stats));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
