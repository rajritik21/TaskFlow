import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Accordion, AccordionSummary, AccordionDetails, Chip, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import CodeIcon from '@mui/icons-material/Code';
import HttpIcon from '@mui/icons-material/Http';
import InfoIcon from '@mui/icons-material/Info';

const Documentation = () => {
  const endpoints = [
    {
      method: 'POST',
      endpoint: '/api/auth/register',
      description: 'Register new user',
      requestBody: `{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}`,
      response: `{
  "message": "User registered successfully"
}`
    },
    {
      method: 'POST',
      endpoint: '/api/auth/login',
      description: 'Authenticate a user',
      requestBody: `{
  "email": "john@example.com",
  "password": "password123"
}`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
    },
    {
      method: 'GET',
      endpoint: '/api/tasks',
      description: 'Get all tasks for the authenticated user',
      requestBody: null,
      response: `[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Task 1",
    "description": "Description for task 1",
    "userId": "60d21b4667d0d8992e610c80",
    "createdAt": "2023-06-22T10:00:00.000Z",
    "updatedAt": "2023-06-22T10:00:00.000Z"
  }
]`
    },
    {
      method: 'POST',
      endpoint: '/api/tasks',
      description: 'Create a new task',
      requestBody: `{
  "title": "New Task",
  "description": "Description for new task"
}`,
      response: `{
  "_id": "60d21b4667d0d8992e610c86",
  "title": "New Task",
  "description": "Description for new task",
  "userId": "60d21b4667d0d8992e610c80",
  "createdAt": "2023-06-22T10:00:00.000Z",
  "updatedAt": "2023-06-22T10:00:00.000Z"
}`
    },
    {
      method: 'PUT',
      endpoint: '/api/tasks/:id',
      description: 'Update a task',
      requestBody: `{
  "title": "Updated Task",
  "description": "Updated description"
}`,
      response: `{
  "_id": "60d21b4667d0d8992e610c86",
  "title": "Updated Task",
  "description": "Updated description",
  "userId": "60d21b4667d0d8992e610c80",
  "createdAt": "2023-06-22T10:00:00.000Z",
  "updatedAt": "2023-06-22T11:00:00.000Z"
}`
    },
    {
      method: 'DELETE',
      endpoint: '/api/tasks/:id',
      description: 'Delete a task',
      requestBody: null,
      response: `{
  "message": "Task deleted successfully"
}`
    }
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
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          bgcolor: '#3f51b5', 
          py: 3, 
          px: 4, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)'
        }}>
          <DescriptionIcon sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              API Documentation
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.8 }}>
              Comprehensive guide to using the Task Manager API
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              mb: 2,
              pb: 1,
              borderBottom: '2px solid rgba(63, 81, 181, 0.2)'
            }}>
              <SecurityIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Authentication
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(0,0,0,0.02)', 
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.08)',
              mb: 2
            }}>
              <Typography paragraph sx={{ mb: 2 }}>
                All API endpoints require JWT authentication. Include the token in the Authorization header:
              </Typography>
              <Paper sx={{ 
                p: 2, 
                bgcolor: 'rgba(0,0,0,0.05)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                borderRadius: 1
              }}>
                Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </Paper>
              
              <Typography paragraph sx={{ mt: 2 }}>
                You can obtain a JWT token by logging in through the <code>/api/auth/login</code> endpoint or by using the Authentication page in this application.
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              mb: 3,
              pb: 1,
              borderBottom: '2px solid rgba(63, 81, 181, 0.2)'
            }}>
              <HttpIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Endpoints
              </Typography>
            </Box>
            
            {endpoints.map((endpoint, index) => (
              <Accordion 
                key={index} 
                sx={{ 
                  mb: 2, 
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '8px !important',
                  overflow: 'hidden',
                  '&::before': { display: 'none' },
                  boxShadow: 'none'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderBottom: '1px solid rgba(0,0,0,0.08)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Chip 
                      label={endpoint.method} 
                      sx={{ 
                        fontWeight: 'bold',
                        bgcolor: methodColors[endpoint.method]?.bg || '#777',
                        color: methodColors[endpoint.method]?.text || '#fff',
                        minWidth: '70px'
                      }} 
                    />
                    <Typography 
                      sx={{ 
                        fontFamily: 'monospace', 
                        fontSize: '1rem',
                        fontWeight: '500',
                        flex: 1
                      }}
                    >
                      {endpoint.endpoint}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                      {endpoint.description}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Typography paragraph variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {endpoint.description}
                  </Typography>
                  
                  {endpoint.requestBody && (
                    <>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                        Request Body
                      </Typography>
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(0,0,0,0.05)',
                        borderRadius: 1
                      }}>
                        <pre style={{ 
                          margin: 0,
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {endpoint.requestBody}
                        </pre>
                      </Paper>
                    </>
                  )}
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
                    Response
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(0,0,0,0.05)',
                    borderRadius: 1
                  }}>
                    <pre style={{ 
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {endpoint.response}
                    </pre>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Documentation;