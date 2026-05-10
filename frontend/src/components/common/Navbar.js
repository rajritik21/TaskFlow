import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [user, setUser] = useState({ username: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get('http://localhost:5001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data for navbar:', error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMenuAnchor(null);
    setUserMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const navItems = [
    { name: 'Tasks', path: '/tasks', icon: <AssignmentIcon /> },
    { name: 'API Endpoints', path: '/endpoints', icon: <CodeIcon /> },
    { name: 'Authentication', path: '/auth', icon: <SecurityIcon /> },
    { name: 'API Tester', path: '/tester', icon: <BuildIcon /> },
    { name: 'Documentation', path: '/docs', icon: <DescriptionIcon /> }
  ];

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#1A1F2B', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/tasks"
          sx={{ 
            flexGrow: 0, 
            mr: 4, 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Task Manager
        </Typography>

        {/* Desktop menu */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{ 
                color: 'white', 
                mx: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        {/* Mobile menu button */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* User name display */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          px: 2,
          py: 0.5
        }}>
          <PersonIcon sx={{ mr: 1, fontSize: '1rem', color: 'white' }} />
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
            {user.username || 'User'}
          </Typography>
        </Box>

        {/* User menu */}
        <Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ color: 'white' }}
            >
              <Avatar 
                src={user.profilePicture} 
                sx={{ width: 32, height: 32, bgcolor: '#3f51b5' }}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { 
                mt: 1.5, 
                width: 200,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            mt: 1.5, 
            maxHeight: '80vh',
            width: 200,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
      >
        {navItems.map((item) => (
          <MenuItem
            key={item.name}
            onClick={handleMenuClose}
            component={Link}
            to={item.path}
            sx={{ py: 1.5 }}
          >
            <Box component="span" sx={{ mr: 2, color: 'primary.main' }}>{item.icon}</Box>
            {item.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar; 