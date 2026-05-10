import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token, fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Task Manager</Typography>
          <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        </Box>

        <Box component="form" onSubmit={handleAddTask} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Task
          </Button>
        </Box>

        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              secondaryAction={
                <Button onClick={() => handleDeleteTask(task._id)} color="error">
                  Delete
                </Button>
              }
            >
              <ListItemText
                primary={task.title}
                secondary={task.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default TaskList;