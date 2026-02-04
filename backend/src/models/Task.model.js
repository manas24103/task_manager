const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ user_id: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ created_at: -1 });

// Static method to find tasks by user
taskSchema.statics.findByUserId = function(userId, filters = {}) {
  const query = { user_id: userId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.priority) {
    query.priority = filters.priority;
  }
  
  return this.find(query)
    .populate('user_id', 'username')
    .sort({ created_at: -1 })
    .limit(filters.limit || 20)
    .skip(filters.offset || 0);
};

// Static method to find all tasks (for admin)
taskSchema.statics.findAll = function(filters = {}) {
  const query = {};
  
  if (filters.user_id) {
    query.user_id = filters.user_id;
  }
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.priority) {
    query.priority = filters.priority;
  }
  
  return this.find(query)
    .populate('user_id', 'username')
    .sort({ created_at: -1 })
    .limit(filters.limit || 20)
    .skip(filters.offset || 0);
};

// Static method to get task statistics
taskSchema.statics.getStats = async function(userId = null) {
  const matchStage = userId ? { user_id: new mongoose.Types.ObjectId(userId) } : {};
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: await this.countDocuments(matchStage),
    status: {
      pending: 0,
      in_progress: 0,
      completed: 0
    }
  };
  
  stats.forEach(stat => {
    result.status[stat._id] = stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('Task', taskSchema);
