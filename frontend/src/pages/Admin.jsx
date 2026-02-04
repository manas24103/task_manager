import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/user.api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserX,
  Crown,
  LogOut,
  Menu,
  X,
  BarChart3,
  Activity
} from 'lucide-react';

const Admin = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`👥 [${timestamp}] FRONTEND ADMIN USER LIST REQUEST`);
      console.log(`👑 [${timestamp}] Admin User: ${user?.username || 'Unknown'} (${user?.role || 'Unknown'})`);
      console.log(`🌐 [${timestamp}] User Agent: ${navigator.userAgent}`);
      
      const response = await userAPI.getAll();
      setUsers(response.data.data);
      
      console.log(`✅ [${timestamp}] FRONTEND USERS LISTED SUCCESSFULLY`);
      console.log(`👥 [${timestamp}] Total users received: ${response.data.data?.length || 0}`);
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND USER LIST ERROR: ${error.message}`);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        const timestamp = new Date().toISOString();
        console.log(`🗑️ [${timestamp}] FRONTEND ADMIN USER DELETION ATTEMPT`);
        console.log(`👑 [${timestamp}] Deleting Admin: ${user?.username || 'Unknown'} (${user?.role || 'Unknown'})`);
        console.log(`🎯 [${timestamp}] Target User ID: ${userId}`);
        console.log(`👤 [${timestamp}] Target Username: ${username}`);
        console.log(`🌐 [${timestamp}] User Agent: ${navigator.userAgent}`);
        
        await userAPI.delete(userId);
        
        console.log(`✅ [${timestamp}] FRONTEND USER DELETED SUCCESSFULLY`);
        console.log(`🗑️ [${timestamp}] Deleted User: ${username} (ID: ${userId})`);
        
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        const timestamp = new Date().toISOString();
        console.log(`❌ [${timestamp}] FRONTEND USER DELETION ERROR: ${error.message}`);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`🔄 [${timestamp}] FRONTEND ADMIN ROLE CHANGE ATTEMPT`);
      console.log(`👑 [${timestamp}] Admin User: ${user?.username || 'Unknown'} (${user?.role || 'Unknown'})`);
      console.log(`🎯 [${timestamp}] Target User ID: ${userId}`);
      console.log(`🔄 [${timestamp}] New Role: ${newRole}`);
      console.log(`🌐 [${timestamp}] User Agent: ${navigator.userAgent}`);
      
      await userAPI.updateRole(userId, { role: newRole });
      
      console.log(`✅ [${timestamp}] FRONTEND USER ROLE UPDATED SUCCESSFULLY`);
      console.log(`🔄 [${timestamp}] User ID ${userId} role changed to ${newRole}`);
      
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND ROLE CHANGE ERROR: ${error.message}`);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    return role === 'admin' ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
  };

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-500/30 text-purple-200 border-purple-500/30' 
      : 'bg-blue-500/30 text-blue-200 border-blue-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-300 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-white/70 capitalize">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Crown className="w-5 h-5 text-yellow-300" />
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
          <div className="md:hidden backdrop-blur-lg bg-white/10 border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/admin" className="text-white/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Admin Panel
              </a>
              <a href="/tasks" className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Tasks
              </a>
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Crown className="w-4 h-4 text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-white/70 capitalize">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  User Management
                </h1>
                <p className="text-white/80 text-lg">
                  Manage all users and their permissions
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Administrators</p>
                <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Regular Users</p>
                <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-purple-600">All Roles</option>
                <option value="admin" className="bg-purple-600">Admin</option>
                <option value="user" className="bg-purple-600">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-12 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="w-10 h-10 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
              <p className="text-white/70">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredUsers.map((userItem) => (
              <div key={userItem._id} className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 transform hover:scale-[1.01] transition-all duration-300 hover:bg-white/15">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getRoleColor(userItem.role)} border`}>
                        {getRoleIcon(userItem.role)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{userItem.fullName}</h3>
                        <p className="text-white/70 text-sm mb-2">@{userItem.username}</p>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <Mail className="w-4 h-4" />
                          <span>{userItem.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(userItem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                    <select
                      value={userItem.role}
                      onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                      disabled={userItem._id === user._id}
                    >
                      <option value="user" className="bg-purple-600">User</option>
                      <option value="admin" className="bg-purple-600">Admin</option>
                    </select>
                    
                    <button
                      onClick={() => handleDeleteUser(userItem._id, userItem.username)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors group"
                      disabled={userItem._id === user._id}
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

export default Admin;
