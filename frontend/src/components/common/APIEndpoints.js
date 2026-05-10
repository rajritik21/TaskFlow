import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Card, CardContent } from '@mui/material';

const APIEndpoints = () => {
  const endpoints = [
    { method: 'POST', endpoint: '/api/auth/register', description: 'Register new user' },
    { method: 'POST', endpoint: '/api/auth/login', description: 'User login' },
    { method: 'GET', endpoint: '/api/tasks', description: 'Get all tasks' },
    { method: 'POST', endpoint: '/api/tasks', description: 'Create new task' },
    { method: 'PUT', endpoint: '/api/tasks/:id', description: 'Update task' },
    { method: 'DELETE', endpoint: '/api/tasks/:id', description: 'Delete task' }
  ];

  // Define method colors
  const methodColors = {
    GET: { bg: '#61affe', text: '#fff' },
    POST: { bg: '#49cc90', text: '#fff' },
    PUT: { bg: '#fca130', text: '#fff' },
    DELETE: { bg: '#f93e3e', text: '#fff' }
  };

  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: '#f5f7ff', 
      minHeight: '100vh', 
      width: '100%',
      boxSizing: 'border-box',
      backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #e3eaff 100%)'
    }}>
      <Card sx={{ 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          bgcolor: '#3f51b5', 
          py: 3, 
          px: 4, 
          color: 'white',
          backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            API Endpoints
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.8 }}>
            Available routes for your application
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 0 }}>
          <Table sx={{ '& .MuiTableCell-root': { p: 2 } }}>
            <TableHead sx={{ 
              bgcolor: 'rgba(0,0,0,0.04)', 
              '& .MuiTableCell-root': { 
                fontWeight: 'bold', 
                color: '#3f51b5', 
                fontSize: '1rem' 
              } 
            }}>
              <TableRow>
                <TableCell width="15%">Method</TableCell>
                <TableCell width="35%">Endpoint</TableCell>
                <TableCell width="50%">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((endpoint, index) => (
                <TableRow key={index} sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' },
                  '&:hover': { bgcolor: 'rgba(63, 81, 181, 0.08)' },
                  transition: 'background-color 0.2s'
                }}>
                  <TableCell>
                    <Chip 
                      label={endpoint.method} 
                      sx={{ 
                        fontWeight: 'bold',
                        bgcolor: methodColors[endpoint.method]?.bg || '#777',
                        color: methodColors[endpoint.method]?.text || '#fff',
                        minWidth: '70px',
                        fontSize: '0.85rem'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ 
                      fontFamily: 'monospace', 
                      fontWeight: 'medium', 
                      fontSize: '0.95rem',
                      bgcolor: 'rgba(0,0,0,0.05)',
                      p: 1,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}>
                      {endpoint.endpoint}
                    </Typography>
                  </TableCell>
                  <TableCell>{endpoint.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default APIEndpoints;