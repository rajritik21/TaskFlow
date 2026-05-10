import React, { useState } from 'react';
import { 
  Box, TextField, Button, Select, MenuItem, Typography, 
  Card, CardContent, FormControl, InputLabel, Chip, 
  Divider, Grid, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const APITester = () => {
  const { token } = useAuth();
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);

  const methodColors = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e'
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      setResponse(null);
      setStatusCode(null);
      
      const config = {
        method: method,
        url: endpoint,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (method !== 'GET' && requestBody) {
        try {
          config.data = JSON.parse(requestBody);
        } catch (e) {
          setResponse({ error: 'Invalid JSON in request body' });
          setStatusCode(400);
          setLoading(false);
          return;
        }
      }

      const result = await axios(config);
      setResponse(result.data);
      setStatusCode(result.status);
      setLoading(false);
    } catch (error) {
      setResponse(error.response?.data || { error: 'Request failed' });
      setStatusCode(error.response?.status || 500);
      setLoading(false);
    }
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
          <CodeIcon sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              API Tester
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.8 }}>
              Test your API endpoints easily
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(0,0,0,0.02)', 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SendIcon fontSize="small" color="primary" />
                  Request
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Method</InputLabel>
                  <Select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    label="Method"
                    sx={{
                      '& .MuiSelect-select': {
                        color: methodColors[method],
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <MenuItem value="GET" sx={{ color: methodColors.GET, fontWeight: 'bold' }}>GET</MenuItem>
                    <MenuItem value="POST" sx={{ color: methodColors.POST, fontWeight: 'bold' }}>POST</MenuItem>
                    <MenuItem value="PUT" sx={{ color: methodColors.PUT, fontWeight: 'bold' }}>PUT</MenuItem>
                    <MenuItem value="DELETE" sx={{ color: methodColors.DELETE, fontWeight: 'bold' }}>DELETE</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="API Endpoint"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  sx={{ mb: 3 }}
                  placeholder="http://localhost:5001/api/tasks"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Request Body (JSON)"
                  multiline
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  sx={{ mb: 3 }}
                  disabled={method === 'GET'}
                  placeholder={method !== 'GET' ? '{\n  "key": "value"\n}' : 'No body for GET requests'}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }
                  }}
                />

                <Button 
                  variant="contained" 
                  onClick={handleTest}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                  disabled={loading || !endpoint}
                  sx={{ 
                    py: 1.5, 
                    px: 3, 
                    bgcolor: methodColors[method],
                    '&:hover': { 
                      bgcolor: method === 'GET' ? '#4a8eca' : 
                              method === 'POST' ? '#3da57d' : 
                              method === 'PUT' ? '#d98628' : 
                              '#d83535'
                    },
                    borderRadius: 2
                  }}
                >
                  {loading ? 'SENDING...' : 'SEND REQUEST'}
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(0,0,0,0.02)', 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon fontSize="small" color="primary" />
                    Response
                  </Typography>
                  
                  {statusCode && (
                    <Chip 
                      icon={statusCode < 400 ? <CheckCircleIcon /> : <ErrorIcon />}
                      label={`Status: ${statusCode}`}
                      sx={{ 
                        bgcolor: statusCode < 400 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: statusCode < 400 ? '#388e3c' : '#d32f2f',
                        fontWeight: 'bold',
                        borderColor: statusCode < 400 ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)',
                        border: '1px solid'
                      }}
                    />
                  )}
                </Box>
                
                {loading ? (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <CircularProgress />
                    <Typography color="text.secondary">Fetching response...</Typography>
                  </Box>
                ) : response ? (
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(0,0,0,0.04)', 
                      borderRadius: 2,
                      overflow: 'auto',
                      flex: 1,
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <pre style={{ 
                      margin: 0,
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-word',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}>
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: 'text.secondary',
                    gap: 1
                  }}>
                    <CodeIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                    <Typography>Response will appear here</Typography>
                    <Typography variant="body2" sx={{ maxWidth: 300, textAlign: 'center', mt: 1 }}>
                      Enter an endpoint and click "Send Request" to test your API
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default APITester;