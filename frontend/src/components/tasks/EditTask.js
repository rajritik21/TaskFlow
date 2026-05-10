import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

const EditTask = ({ task, onUpdate, onCancel }) => {
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description
  });
  const { token } = useAuth();
  const { updateTask } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTask(token, task._id, editedTask);
    onUpdate();
  };

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#3f51b5', fontWeight: 'bold' }}>
        Edit Task
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Title
        </Typography>
        <TextField
          fullWidth
          placeholder="Title"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
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
          placeholder="Description"
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
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
          multiline
          minRows={3}
          maxRows={10}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { width: '100%' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              bgcolor: '#4caf50', 
              '&:hover': { bgcolor: '#388e3c' } 
            }}
          >
            SAVE
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outlined"
          >
            CANCEL
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditTask;