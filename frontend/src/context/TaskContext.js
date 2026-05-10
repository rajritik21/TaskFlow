import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (token, task) => {
    try {
      await axios.post(`${API_BASE_URL}/api/tasks`, task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(token);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (token, taskId, updatedTask) => {
    try {
      console.log('Updating task:', taskId, 'with data:', updatedTask);
      
      // Make sure taskId is a valid string
      if (!taskId) {
        console.error('Invalid task ID for update');
        throw new Error('Invalid task ID');
      }
      
      const response = await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Task update response:', response.data);
      
      // Update the tasks array locally to reflect the change immediately
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      
      // Also refresh from server to ensure we have the latest data
      await fetchTasks(token);
      
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      console.error('Error details:', error.response?.data);
      throw error; // Propagate error to component
    }
  };

  const deleteTask = async (token, taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh tasks list after deletion
      await fetchTasks(token);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);