const Task = require('../models/Task.model');
const { successResponse, errorResponse } = require('../utils/response');

class TaskService {
  async getAllTasks(filters = {}) {
    const tasks = await Task.findAll(filters);
    return tasks;
  }

  async getTaskById(id, user) {
    const task = await Task.findById(id).populate('user_id', 'username');
    
    if (!task) {
      return null;
    }

    // Check if user has access to this task
    if (user.role !== 'admin' && task.user_id._id.toString() !== user._id.toString()) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }

    return task;
  }

  async createTask(taskData) {
    const task = await Task.create(taskData);
    return await Task.findById(task._id).populate('user_id', 'username');
  }

  async updateTask(id, updateData, user) {
    // First check if task exists and user has access
    const existingTask = await this.getTaskById(id, user);
    if (!existingTask) {
      return null;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    }).populate('user_id', 'username');

    return updatedTask;
  }

  async deleteTask(id, user) {
    // First check if task exists and user has access
    const existingTask = await this.getTaskById(id, user);
    if (!existingTask) {
      return null;
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    return deletedTask;
  }

  async getTaskStats(user) {
    const userId = user.role !== 'admin' ? user._id : null;
    const stats = await Task.getStats(userId);
    return stats;
  }

  async getUserTasks(userId, filters = {}) {
    const tasks = await Task.findByUserId(userId, filters);
    return tasks;
  }
}

module.exports = new TaskService();
