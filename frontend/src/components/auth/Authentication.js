import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, TextField, Divider, Tooltip, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';

const Authentication = () => {
  const { token } = useAuth();
  const [jwtToken, setJwtToken] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateToken = () => {
    setJwtToken(token);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(jwtToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <SecurityIcon sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Authentication
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.8 }}>
              Manage your JWT tokens securely
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleGenerateToken}
              startIcon={<LockIcon />}
              sx={{ 
                py: 1.5, 
                px: 3, 
                bgcolor: '#4caf50',
                '&:hover': { 
                  bgcolor: '#3d8b40' 
                },
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)'
              }}
            >
              GENERATE JWT TOKEN
            </Button>
            <Typography variant="body2" color="text.secondary">
              Click to generate a new token using your credentials
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon color="primary" fontSize="small" />
            JWT Token
            {jwtToken && (
              <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                <IconButton 
                  size="small" 
                  onClick={handleCopyToken}
                  sx={{ ml: 1, color: copied ? '#4caf50' : 'primary.main' }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={5}
            value={jwtToken}
            placeholder="Your JWT token will appear here"
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: {
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 2
              }
            }}
          />
          
          {jwtToken && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(63, 81, 181, 0.08)', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                🔒 This token is used for authentication in your API requests. Include it in your headers as:
              </Typography>
              <Box sx={{ 
                bgcolor: 'rgba(0,0,0,0.05)', 
                p: 1.5, 
                mt: 1, 
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                Authorization: Bearer {jwtToken.substring(0, 15)}...
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Authentication;