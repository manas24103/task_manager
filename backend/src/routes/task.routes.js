const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const { authenticateToken, authorize } = require('../middlewares/auth.middleware');
const { validateTask, validateTaskUpdate } = require('../validators/task.validator');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management operations
 */

// Get all tasks (Admin gets all, User gets own tasks)
router.get('/', authenticateToken, TaskController.getAllTasks);

// Get task statistics
router.get('/stats', authenticateToken, TaskController.getTaskStats);

// Create new task
router.post('/', authenticateToken, validateTask, TaskController.createTask);

// Get task by ID
router.get('/:id', authenticateToken, TaskController.getTaskById);

// Update task
router.put('/:id', authenticateToken, validateTaskUpdate, TaskController.updateTask);

// Delete task
router.delete('/:id', authenticateToken, TaskController.deleteTask);

module.exports = router;
