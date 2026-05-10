import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Divider, 
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Badge,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTasks } from '../context/TaskContext';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link as RouterLink } from 'react-router-dom';

const Profile = () => {
  const { token } = useAuth();
  const { tasks, fetchTasks, updateTask } = useTasks();
  const [user, setUser] = useState({
    username: '',
    email: '',
    createdAt: '',
    profilePicture: ''
  });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchUserData();
      await fetchTasks(token);
    } catch (error) {
      console.error("Failed to load user data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      console.log('Fetching user profile with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://localhost:5001/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Profile data received:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      setNotification({
        open: true,
        message: `Failed to load profile data: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
      throw error;
    }
  }, [token, setNotification]);

  useEffect(() => {
    // Calculate task statistics
    if (tasks && tasks.length > 0) {
      const completed = tasks.filter(task => task.completed).length;
      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: tasks.length - completed
      });
    } else {
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
      });
    }
  }, [tasks]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      setNotification({
        open: true,
        message: 'Please select an image file',
        severity: 'error'
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        open: true,
        message: 'File size should be less than 5MB',
        severity: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('username', user.username);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/upload-profile-picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser({
        ...user,
        profilePicture: response.data.profilePicture
      });

      setNotification({
        open: true,
        message: 'Profile picture updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to upload profile picture',
        severity: 'error'
      });
    }
  };

  const handleMarkTaskComplete = async (taskId) => {
    try {
      console.log('Marking task complete with ID:', taskId);
      
      // Make sure taskId is a valid string
      if (!taskId) {
        console.error('Invalid task ID:', taskId);
        setNotification({
          open: true,
          message: 'Invalid task ID',
          severity: 'error'
        });
        return;
      }
      
      // First update locally for immediate feedback
      const taskToUpdate = tasks.find(task => task._id === taskId);
      if (taskToUpdate) {
        // Show task title in notification
        const taskTitle = taskToUpdate.title;
        
        // Call the specific complete endpoint
        await axios.put(
          `http://localhost:5001/api/tasks/${taskId}/complete`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Refresh tasks to update stats
        await fetchTasks(token);
        
        setNotification({
          open: true,
          message: `Task "${taskTitle}" marked as completed`,
          severity: 'success'
        });
      } else {
        console.error('Task not found in local state:', taskId);
        setNotification({
          open: true,
          message: 'Task not found',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error marking task as complete:', error);
      console.error('Task ID:', taskId);
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to update task',
        severity: 'error'
      });
    }
  };

  if (error) {
    return (
      <Box sx={{ 
        p: 4, 
        minHeight: '100vh', 
        bgcolor: '#f5f7ff',
        backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #e3eaff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            textAlign: 'center',
            maxWidth: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 70, mb: 2 }} />
          
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Profile
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error.response?.data?.message || error.message || 'An unexpected error occurred'}
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={loadUserData}
            sx={{ borderRadius: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 4, 
      minHeight: '100vh', 
      bgcolor: '#f5f7ff',
      backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #e3eaff 100%)'
    }}>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Hidden file input for profile picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700, 
          color: '#3f51b5',
          mb: 4,
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        My Profile
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
      <Grid container spacing={4}>
        {/* User Profile Card */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: '100%',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton 
                    sx={{ 
                      bgcolor: '#3f51b5', 
                      color: 'white',
                      '&:hover': { bgcolor: '#303f9f' },
                      width: 36,
                      height: 36
                    }}
                    onClick={handleProfilePictureClick}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar 
                  src={user.profilePicture}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: '#3f51b5',
                    fontSize: '2.5rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                  }}
                  onClick={handleProfilePictureClick}
                >
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </Badge>
              <Box sx={{ ml: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  {user.username ? user.username : 'User'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email ? user.email : 'email@example.com'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since: {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, color: '#3f51b5' }}>
              Account Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1">
                  {user.username ? user.username : 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {user.email ? user.email : 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Status
                </Typography>
                <Chip 
                  label="Active" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 0.5 }} 
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                component={RouterLink}
                to="/settings"
                sx={{ borderRadius: 2 }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Card */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
              }
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#3f51b5' }}>
              Task Statistics
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(63, 81, 181, 0.1)', 
                  borderRadius: 2,
                  boxShadow: 'none',
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Total Tasks
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="#3f51b5">
                      {stats.totalTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.1)', 
                  borderRadius: 2,
                  boxShadow: 'none'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="#4caf50">
                      {stats.completedTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.1)', 
                  borderRadius: 2,
                  boxShadow: 'none'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary" gutterBottom>
                      Pending
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="#ff9800">
                      {stats.pendingTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2, color: '#3f51b5' }}>
              Recent Tasks
            </Typography>

            <Box sx={{ mb: 2 }}>
              {tasks && tasks.length > 0 ? 
                tasks.slice(0, 3).map((task, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      mb: 1, 
                      borderRadius: 2, 
                      bgcolor: 'background.paper',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      borderLeft: `4px solid ${task.completed ? '#4caf50' : '#ff9800'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="medium" noWrap>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Created: {formatDate(task.createdAt)}
                      </Typography>
                    </Box>
                    
                    {!task.completed && (
                      <IconButton 
                        color="success" 
                        onClick={() => handleMarkTaskComplete(task._id)}
                        sx={{ 
                          ml: 1,
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          }
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </Box>
                )) : (
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    No recent tasks
                  </Typography>
                )
              }
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                component={RouterLink}
                to="/tasks"
                sx={{ borderRadius: 2 }}
              >
                View All Tasks
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      )}
    </Box>
  );
};

export default Profile; 