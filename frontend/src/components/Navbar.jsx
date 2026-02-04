import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="navbar-brand">
              Task Manager
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`navbar-link ${isActive('/') ? 'navbar-link-active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={`navbar-link ${isActive('/tasks') ? 'navbar-link-active' : ''}`}
              >
                Tasks
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {user?.username} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
