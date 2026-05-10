import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Snackbar, 
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Fab,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditTask from './EditTask';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import axios from 'axios';

const Tasks = () => {
  const { token } = useAuth();
  const { tasks, fetchTasks, addTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTasks(token);
    }
  }, [token, fetchTasks]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTask(token, newTask);
    setNewTask({ title: '', description: '' });
    setOpenAddDialog(false);
    showNotification('New task added successfully');
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = async () => {
    await fetchTasks(token);
    const updatedTaskTitle = editingTask ? editingTask.title : "Task";
    setEditingTask(null);
    showNotification(`Task "${updatedTaskTitle}" updated successfully`);
  };

  const handleDelete = async (taskId, taskTitle) => {
    await deleteTask(token, taskId);
    showNotification(`Task "${taskTitle}" deleted successfully`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box 
      sx={{ 
        p: 4, 
        bgcolor: '#f5f7ff', 
        minHeight: '100vh', 
        width: '100%',
        boxSizing: 'border-box',
        backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #e3eaff 100%)'
      }}
    >
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ width: '100%' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%', 
            maxWidth: '400px',
            '& .MuiAlert-message': {
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#3f51b5',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          My Tasks
        </Typography>
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={() => setOpenAddDialog(true)}
          sx={{ boxShadow: '0 8px 16px rgba(63, 81, 181, 0.2)', position: 'absolute', right: '30px' }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#3f51b5', color: 'white', fontWeight: 'bold' }}>
          Create New Task
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Title
            </Typography>
            <TextField
              autoFocus
              fullWidth
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              sx={{ 
                mb: 3,
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#c4c4c4',
                    borderWidth: '1.5px',
                    borderRight: '1.5px solid #c4c4c4'
                  },
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                    borderRight: '1.5px solid #3f51b5'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                    borderWidth: '2px',
                    borderRight: '2px solid #3f51b5'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '12px 16px',
                  width: '100%'
                }
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { width: '100%' } }}
            />
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Description
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              sx={{ 
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#c4c4c4',
                    borderWidth: '1.5px',
                    borderRight: '1.5px solid #c4c4c4'
                  },
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                    borderRight: '1.5px solid #3f51b5'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                    borderWidth: '2px',
                    borderRight: '2px solid #3f51b5'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '12px 16px',
                  width: '100%'
                }
              }}
              multiline
              minRows={4}
              maxRows={10}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { width: '100%' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenAddDialog(false)} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            startIcon={<CheckCircleIcon />}
            sx={{ 
              bgcolor: '#4caf50', 
              '&:hover': { bgcolor: '#388e3c' } 
            }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
        {tasks.length === 0 ? (
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 5, 
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No tasks available. Create your first task!
              </Typography>
            </Paper>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                <Card 
                  sx={{ 
                    minHeight: '180px',
                    height: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {editingTask && editingTask._id === task._id ? (
                    <EditTask 
                      task={task}
                      onUpdate={handleUpdate}
                      onCancel={() => setEditingTask(null)}
                    />
                  ) : (
                    <>
                      <CardContent sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#3f51b5',
                            mb: 1.5,
                            borderBottom: '2px solid #e0e0e0',
                            pb: 1,
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: '1rem', 
                            lineHeight: 1.5, 
                            mb: 2
                          }}
                        >
                          {task.description}
                        </Typography>
                        {task.createdAt && (
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Chip
                              label={`Created: ${formatDate(task.createdAt)}`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                bgcolor: 'rgba(63, 81, 181, 0.1)',
                                borderColor: 'rgba(63, 81, 181, 0.2)',
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2.5 }}>
                        <IconButton 
                          size="medium" 
                          onClick={() => handleEdit(task)}
                          sx={{ 
                            color: '#ff9800', 
                            mr: 1.5,
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(255, 152, 0, 0.1)'
                            }
                          }}
                        >
                          <EditIcon fontSize="medium" />
                        </IconButton>
                        <IconButton 
                          size="medium" 
                          onClick={() => handleDelete(task._id, task.title)}
                          sx={{ 
                            color: '#f44336',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              bgcolor: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </CardActions>
                    </>
                  )}
                </Card>
              </Zoom>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Tasks;