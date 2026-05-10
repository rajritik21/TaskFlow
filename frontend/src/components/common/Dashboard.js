import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardSummary from './DashboardSummary';
import TeamsView from '../teams/TeamsView';
import ProjectsView from '../projects/ProjectsView';
import TasksView from '../tasks/TasksView';
import ProfileView from '../auth/ProfileView';
import { Group, Assignment, CheckCircle, ExitToApp, Menu, Close, Dashboard as DashboardIcon, Person } from '@mui/icons-material';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: <DashboardIcon />, exact: true },
    { path: '/dashboard/teams', label: 'Teams', icon: <Group /> },
    { path: '/dashboard/projects', label: 'Projects', icon: <Assignment /> },
    { path: '/dashboard/tasks', label: 'Tasks', icon: <CheckCircle /> },
    { path: '/dashboard/profile', label: 'Profile', icon: <Person /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="icon-btn" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </button>
        <h2>TaskMaster Pro</h2>
      </div>

      {/* Sidebar */}
      <div className={`sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="heading-gradient">TaskMaster</h2>
          <button className="icon-btn mobile-close" onClick={() => setSidebarOpen(false)}>
            <Close />
          </button>
        </div>
        
        <div className="user-info">
          <div className="avatar" style={user?.profilePicture ? { background: 'none' } : {}}>
            {user?.profilePicture 
              ? <img src={user.profilePicture} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}/>
              : (user?.username?.[0]?.toUpperCase() || 'U')}
          </div>
          <div className="user-details">
            <div className="username">Hi, {user?.username}</div>
            <div className="email">{user?.email}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.includes(item.path);
              
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item text-danger" onClick={handleLogout}>
            <ExitToApp />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardSummary />} />
          <Route path="/teams" element={<TeamsView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/tasks" element={<TasksView />} />
          <Route path="/profile" element={<ProfileView />} />
        </Routes>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default Dashboard;
