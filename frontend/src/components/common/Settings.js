import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  TextField,
  Switch,
  FormControlLabel,
  FormGroup,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Save } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { token } = useAuth();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  
  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    systemNotifications: true
  });
  
  // Show/hide password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Loaded user data:', response.data);
        
        setProfileData({
          username: response.data.username || '',
          email: response.data.email || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setNotification({
          open: true,
          message: 'Failed to load user data',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile data:', profileData);
      
      const response = await axios.put(
        'http://localhost:5001/api/auth/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Profile update response:', response.data);
      
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.response?.data);
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setNotification({
        open: true,
        message: 'Password should be at least 6 characters long',
        severity: 'error'
      });
      return;
    }

    try {
      console.log('Changing password...');
      
      const response = await axios.put(
        'http://localhost:5001/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Password change response:', response.data);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setNotification({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      console.error('Error details:', error.response?.data);
      
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to change password',
        severity: 'error'
      });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await axios.put(
        'http://localhost:5001/api/users/notification-settings',
        notificationSettings,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotification({
        open: true,
        message: 'Notification settings updated',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to update notification settings',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

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
        Account Settings
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Profile Settings */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#3f51b5' }}>
                Profile Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    placeholder="Enter your username"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSaveProfile}
                  sx={{
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Password Settings */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#3f51b5' }}>
                Change Password
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Current Password
                  </Typography>
                  <TextField
                    fullWidth
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('current')}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    New Password
                  </Typography>
                  <TextField
                    fullWidth
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('new')}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Confirm New Password
                  </Typography>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('confirm')}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  sx={{
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Notification Settings */}
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#3f51b5' }}>
                Notification Settings
              </Typography>
              
              <List sx={{ width: '100%' }}>
                <ListItem>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive task updates and reminders via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemText 
                    primary="Task Reminders" 
                    secondary="Get notified about upcoming deadlines and tasks"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="taskReminders"
                      checked={notificationSettings.taskReminders}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemText 
                    primary="Weekly Digest" 
                    secondary="Receive a summary of your weekly activity"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="weeklyDigest"
                      checked={notificationSettings.weeklyDigest}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemText 
                    primary="System Notifications" 
                    secondary="Get notified about important system updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="systemNotifications"
                      checked={notificationSettings.systemNotifications}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveNotifications}
                  sx={{
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Save Preferences
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Settings; 