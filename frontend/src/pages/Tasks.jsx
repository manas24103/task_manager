import React, { useState, useEffect } from 'react';
import { taskAPI } from '../api/task.api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Filter, 
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Menu,
  X,
  User,
  LogOut,
  BarChart3,
  ChevronDown,
  XCircle
} from 'lucide-react';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  priority: yup.string().oneOf(['low', 'medium', 'high']).optional(),
  status: yup.string().oneOf(['pending', 'in_progress', 'completed']).optional(),
});

const Tasks = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`📋 [${timestamp}] FRONTEND TASK FETCH ATTEMPT`);
      console.log(`👤 [${timestamp}] Fetching User: ${user?.username || 'Unknown'} (${user?.role || 'Unknown'})`);
      console.log(`🔍 [${timestamp}] Fetch Filters:`, JSON.stringify(filters, null, 2));
      
      const response = await taskAPI.getAll(filters);
      setTasks(response.data.data);
      
      console.log(`✅ [${timestamp}] FRONTEND TASKS FETCHED SUCCESSFULLY`);
      console.log(`📊 [${timestamp}] Total tasks received: ${response.data.data?.length || 0}`);
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND TASK FETCH ERROR: ${error.message}`);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const timestamp = new Date().toISOString();
      
      if (editingTask) {
        console.log(`✏️ [${timestamp}] FRONTEND TASK UPDATE ATTEMPT`);
        console.log(`👤 [${timestamp}] Updating User: ${user?.username || 'Unknown'} (${user?.role || 'Unknown'})`);
        console.log(`🆔 [${timestamp}] Task ID: ${editingTask._id}`);
        console.log(`📝 [${timestamp}] Update Data:`, JSON.stringify(data, null, 2));
        
        // 🔥 Only send allowed update fields
        const updateData = {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority
        };
        
        await taskAPI.update(editingTask._id, updateData);
        
        console.log(`✅ [${timestamp}] FRONTEND TASK UPDATED SUCCESSFULLY`);
        toast.success('Task updated successfully');
        setEditingTask(null);
        setShowCreateForm(false); // 🔥 Close the form after editing
        reset(); // 🔥 Clear form data
      } else {
        console.log(`➕ [${timestamp}] FRONTEND TASK CREATION ATTEMPT`);
        console.log(`👤 [${timestamp}] Creating User: ${user?.username || 'Unknown'} (${user?.role || 'Unknown'})`);
        console.log(`📝 [${timestamp}] Task Data:`, JSON.stringify(data, null, 2));
        
        await taskAPI.create(data);
        
        console.log(`✅ [${timestamp}] FRONTEND TASK CREATED SUCCESSFULLY`);
        toast.success('Task created successfully');
        setShowCreateForm(false);
      }
      fetchTasks();
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND TASK ${editingTask ? 'UPDATE' : 'CREATION'} ERROR: ${error.message}`);
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    reset(task);
    setShowCreateForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingTask(null);
    reset();
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/30 text-red-200 border-red-500/30';
      case 'medium': return 'bg-yellow-500/30 text-yellow-200 border-yellow-500/30';
      case 'low': return 'bg-green-500/30 text-green-200 border-green-500/30';
      default: return 'bg-white/20 text-white/70 border-white/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/30 text-green-200 border-green-500/30';
      case 'in_progress': return 'bg-purple-500/30 text-purple-200 border-purple-500/30';
      case 'pending': return 'bg-white/20 text-white/70 border-white/20';
      default: return 'bg-white/20 text-white/70 border-white/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Activity className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-300 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 opacity-50"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Target className="w-8 h-8 text-white mr-3" />
                <span className="text-xl font-bold text-white">TaskFlow</span>
              </div>
              <div className="flex space-x-1">
                <a href="/" className="text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </a>
                <a href="/tasks" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Tasks
                </a>
                {user?.role === 'admin' && (
                  <a href="/admin" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Admin
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden backdrop-blur-xl bg-white/5 border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Dashboard
              </a>
              <a href="/tasks" className="text-white/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Tasks
              </a>
              {user?.role === 'admin' && (
                <a href="/admin" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Admin
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tasks Management</h1>
                <p className="text-gray-300">Manage and organize your tasks efficiently</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-800">All Status</option>
                <option value="pending" className="bg-gray-800">Pending</option>
                <option value="in_progress" className="bg-gray-800">In Progress</option>
                <option value="completed" className="bg-gray-800">Completed</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-800">All Priority</option>
                <option value="low" className="bg-gray-800">Low</option>
                <option value="medium" className="bg-gray-800">Medium</option>
                <option value="high" className="bg-gray-800">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                {editingTask ? <Edit2 className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Task title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-200">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  rows="3"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Priority</label>
                  <select {...register('priority')} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300">
                    <option value="low" className="bg-purple-600">Low</option>
                    <option value="medium" className="bg-purple-600">Medium</option>
                    <option value="high" className="bg-purple-600">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Status</label>
                  <select {...register('status')} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300">
                    <option value="pending" className="bg-purple-600">Pending</option>
                    <option value="in_progress" className="bg-purple-600">In Progress</option>
                    <option value="completed" className="bg-purple-600">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-white text-purple-600 py-3 px-6 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-purple-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-purple-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-12 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-white/70 mb-6">Create your first task to get started!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-purple-600 py-3 px-6 rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.01] transition-all duration-300 hover:bg-white/15">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(task.status)} border`}>
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{task.title}</h3>
                        {task.description && (
                          <p className="text-white/70 text-sm mb-3">{task.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:ml-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                    >
                      <Edit2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-red-200 group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default Tasks;
