import React, { useState, useEffect } from 'react';
import { taskAPI } from '../api/task.api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  TrendingUp, 
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
  Target,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await taskAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-300 rounded-full animate-spin animation-delay-150"></div>
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
                  onClick={handleLogout}
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
                <a href="/" className="text-white/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </a>
                <a href="/tasks" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Tasks
                </a>
                {user?.role === 'admin' && (
                  <a href="/admin" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Admin
                  </a>
                )}
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.fullName || user?.username}! 👋
                  </h1>
                  <p className="text-white/80 text-lg">
                    Here's your productivity overview for today
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-blue-200" />
                </div>
                <span className="text-3xl font-bold text-white">{stats?.total || 0}</span>
              </div>
              <h3 className="text-white/90 font-semibold">Total Tasks</h3>
              <p className="text-white/60 text-sm mt-1">All time tasks created</p>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-6 h-6 text-yellow-200" />
                </div>
                <span className="text-3xl font-bold text-white">{stats?.status?.pending || 0}</span>
              </div>
              <h3 className="text-white/90 font-semibold">Pending</h3>
              <p className="text-white/60 text-sm mt-1">Tasks waiting to start</p>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Activity className="w-6 h-6 text-purple-200" />
                </div>
                <span className="text-3xl font-bold text-white">{stats?.status?.in_progress || 0}</span>
              </div>
              <h3 className="text-white/90 font-semibold">In Progress</h3>
              <p className="text-white/60 text-sm mt-1">Currently working on</p>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                </div>
                <span className="text-3xl font-bold text-white">{stats?.status?.completed || 0}</span>
              </div>
              <h3 className="text-white/90 font-semibold">Completed</h3>
              <p className="text-white/60 text-sm mt-1">Tasks finished</p>
            </div>
          </div>

          {/* Quick Actions & Account Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Plus className="w-6 h-6 mr-2" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/tasks'}
                  className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white group-hover:text-white/90">View All Tasks</div>
                      <div className="text-sm text-white/70">Manage and organize your tasks</div>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <BarChart3 className="w-5 h-5 text-white/70 group-hover:text-white" />
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = '/tasks?action=create'}
                  className="w-full text-left p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl transition-all duration-300 group border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white group-hover:text-white/90">Create New Task</div>
                      <div className="text-sm text-white/70">Add a new task to your list</div>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-2" />
                Account Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Username</span>
                  <span className="font-medium text-white">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Email</span>
                  <span className="font-medium text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Role</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white capitalize">
                    {user?.role}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Member Since</span>
                  <span className="font-medium text-white">Today</span>
                </div>
              </div>
            </div>
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
                onClick={handleLogout}
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
              <a href="/" className="text-white/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Dashboard
              </a>
              <a href="/tasks" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Tasks
              </a>
              {user?.role === 'admin' && (
                <a href="/admin" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Admin
                </a>
              )}
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.fullName || user?.username}! 👋
                </h1>
                <p className="text-gray-300 text-lg">
                  Here's your productivity overview for today
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 text-blue-300" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.total || 0}</span>
            </div>
            <h3 className="text-gray-200 font-semibold">Total Tasks</h3>
            <p className="text-gray-400 text-sm mt-1">All time tasks created</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Clock className="w-6 h-6 text-yellow-300" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.status?.pending || 0}</span>
            </div>
            <h3 className="text-gray-200 font-semibold">Pending</h3>
            <p className="text-gray-400 text-sm mt-1">Tasks waiting to start</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.status?.in_progress || 0}</span>
            </div>
            <h3 className="text-gray-200 font-semibold">In Progress</h3>
            <p className="text-gray-400 text-sm mt-1">Currently working on</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 transform hover:scale-[1.02] transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
              <span className="text-3xl font-bold text-white">{stats?.status?.completed || 0}</span>
            </div>
            <h3 className="text-gray-200 font-semibold">Completed</h3>
            <p className="text-gray-400 text-sm mt-1">Tasks finished</p>
          </div>
        </div>

        {/* Quick Actions & Account Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/tasks'}
                className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-200 group-hover:text-white">View All Tasks</div>
                    <div className="text-sm text-gray-400">Manage and organize your tasks</div>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => window.location.href = '/tasks?action=create'}
                className="w-full text-left p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl transition-all duration-300 group border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-200 group-hover:text-white">Create New Task</div>
                    <div className="text-sm text-gray-400">Add a new task to your list</div>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Username</span>
                <span className="font-medium text-white">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Role</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-white capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Member Since</span>
                <span className="font-medium text-white">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
