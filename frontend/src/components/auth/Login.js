import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';
import axios from 'axios';

// Font Awesome icons
// import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login credentials
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register credentials
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
      login(response.data.token);
      navigate('/tasks');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, registerData);
      alert('Registration successful! Please login.');
      setIsActive(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      alert(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)',
        backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1683309563562-aa3cfde9ed10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '30px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          width: '768px',
          maxWidth: '100%',
          minHeight: '480px',
          ...(isActive && {
            '& .sign-in': {
              transform: 'translateX(100%)'
            },
            '& .sign-up': {
              transform: 'translateX(100%)',
              opacity: 1,
              zIndex: 5,
              animation: 'move 0.6s'
            },
            '& .toggle-container': {
              transform: 'translateX(-100%)',
              borderRadius: '0 150px 100px 0'
            },
            '& .toggle': {
              transform: 'translateX(50%)'
            },
            '& .toggle-left': {
              transform: 'translateX(0)'
            },
            '& .toggle-right': {
              transform: 'translateX(200%)'
            }
          })
        }}
      >
        {/* Sign Up Form */}
        <Box
          className="form-container sign-up"
          sx={{
            position: 'absolute',
            top: 0,
            height: '100%',
            transition: 'all 0.6s ease-in-out',
            left: 0,
            width: '50%',
            opacity: 0,
            zIndex: 1
          }}
        >
          <Box
            component="form"
            onSubmit={handleRegisterSubmit}
            sx={{
              bgcolor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 40px',
              height: '100%'
            }}
          >
            <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Create Account
            </Typography>
            
            <Box className="social-icons" sx={{ display: 'flex', margin: '20px 0' }}>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-google-plus-g"></i>
              </IconButton>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-facebook-f"></i>
              </IconButton>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-github"></i>
              </IconButton>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-linkedin-in"></i>
              </IconButton>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
              or use your email for registration
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Name"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              sx={{
                bgcolor: '#d4effc',
                border: 'none',
                margin: '8px 0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 15px',
                  fontSize: '13px'
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              sx={{
                bgcolor: '#d4effc',
                border: 'none',
                margin: '8px 0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 15px',
                  fontSize: '13px'
                }
              }}
            />
            
            <TextField
              fullWidth
              placeholder="Password"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              sx={{
                bgcolor: '#d4effc',
                border: 'none',
                margin: '8px 0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 15px',
                  fontSize: '13px'
                }
              }}
            />
            
            <Button
              variant="contained"
              type="submit"
              className="button-85"
              sx={{
                marginTop: '20px',
                position: 'relative',
                padding: '0.6em 2em',
                border: 'none',
                outline: 'none',
                color: 'rgb(255, 255, 255)',
                backgroundColor: '#111',
                cursor: 'pointer',
                borderRadius: '10px',
                zIndex: 0,
                '&:before': {
                  content: '""',
                  background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  backgroundSize: '400%',
                  zIndex: -1,
                  filter: 'blur(5px)',
                  width: 'calc(100% + 4px)',
                  height: 'calc(100% + 4px)',
                  animation: 'glowing-button-85 20s linear infinite',
                  transition: 'opacity 0.3s ease-in-out',
                  borderRadius: '10px'
                },
                '&:after': {
                  zIndex: -1,
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#222',
                  left: 0,
                  top: 0,
                  borderRadius: '10px'
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        {/* Sign In Form */}
        <Box
          className="form-container sign-in"
          sx={{
            position: 'absolute',
            top: 0,
            height: '100%',
            transition: 'all 0.6s ease-in-out',
            left: 0,
            width: '50%',
            zIndex: 2
          }}
        >
          <Box
            component="form"
            onSubmit={handleLoginSubmit}
            sx={{
              bgcolor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 40px',
              height: '100%'
            }}
          >
            <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Sign In
            </Typography>
            
            <Box className="social-icons" sx={{ display: 'flex', margin: '20px 0' }}>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-google-plus-g"></i>
              </IconButton>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-facebook-f"></i>
              </IconButton>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-github"></i>
              </IconButton>
              <IconButton href="#" className="icon" sx={{ border: '1px solid #67db66', borderRadius: '20%', width: '40px', height: '40px', margin: '0 3px' }}>
                <i className="fab fa-linkedin-in"></i>
              </IconButton>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, fontSize: '12px' }}>
              or use your email password
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginChange}
              sx={{
                bgcolor: '#d4effc',
                border: 'none',
                margin: '8px 0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 15px',
                  fontSize: '13px'
                }
              }}
            />
            
            <TextField
              fullWidth
              placeholder="Password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              sx={{
                bgcolor: '#d4effc',
                border: 'none',
                margin: '8px 0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  padding: '10px 15px',
                  fontSize: '13px'
                }
              }}
            />
            
            <Typography 
              variant="body2" 
              component="a" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsActive(true);
              }}
              sx={{ 
                color: '#333', 
                fontSize: '13px', 
                textDecoration: 'none', 
                margin: '15px 0 10px',
                cursor: 'pointer'
              }}
            >
              Don't have account? Register
            </Typography>
            
            <Button
              variant="contained"
              type="submit"
              className="button-85"
              sx={{
                marginTop: '10px',
                position: 'relative',
                padding: '0.6em 2em',
                border: 'none',
                outline: 'none',
                color: 'rgb(255, 255, 255)',
                backgroundColor: '#111',
                cursor: 'pointer',
                borderRadius: '10px',
                zIndex: 0,
                '&:before': {
                  content: '""',
                  background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  backgroundSize: '400%',
                  zIndex: -1,
                  filter: 'blur(5px)',
                  width: 'calc(100% + 4px)',
                  height: 'calc(100% + 4px)',
                  animation: 'glowing-button-85 20s linear infinite',
                  transition: 'opacity 0.3s ease-in-out',
                  borderRadius: '10px'
                },
                '&:after': {
                  zIndex: -1,
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#222',
                  left: 0,
                  top: 0,
                  borderRadius: '10px'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Toggle Container */}
        <Box
          className="toggle-container"
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            transition: 'all 0.6s ease-in-out',
            borderRadius: '150px 0 0 100px',
            zIndex: 1000
          }}
        >
          <Box
            className="toggle"
            sx={{
              backgroundColor: '#5c6bc0',
              height: '100%',
              background: 'linear-gradient(to right, #5c6bc0, #34167b)',
              color: '#fff',
              position: 'relative',
              left: '-100%',
              height: '100%',
              width: '200%',
              transform: 'translateX(0)',
              transition: 'all 0.6s ease-in-out'
            }}
          >
            {/* Toggle Left Panel */}
            <Box
              className="toggle-panel toggle-left"
              sx={{
                position: 'absolute',
                width: '50%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '0 30px',
                textAlign: 'center',
                top: 0,
                transform: 'translateX(-200%)',
                transition: 'all 0.6s ease-in-out'
              }}
            >
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold', color: 'white' }}>
                Welcome Back!
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0', color: 'white' }}>
                Enter your personal details to use all of site features
              </Typography>
              <Button
                id="login"
                onClick={() => setIsActive(false)}
                className="button-85"
                sx={{
                  position: 'relative',
                  padding: '0.6em 2em',
                  border: 'none',
                  outline: 'none',
                  color: 'rgb(255, 255, 255)',
                  backgroundColor: '#111',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  zIndex: 0,
                  '&:before': {
                    content: '""',
                    background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    backgroundSize: '400%',
                    zIndex: -1,
                    filter: 'blur(5px)',
                    width: 'calc(100% + 4px)',
                    height: 'calc(100% + 4px)',
                    animation: 'glowing-button-85 20s linear infinite',
                    transition: 'opacity 0.3s ease-in-out',
                    borderRadius: '10px'
                  },
                  '&:after': {
                    zIndex: -1,
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#222',
                    left: 0,
                    top: 0,
                    borderRadius: '10px'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>

            {/* Toggle Right Panel */}
            <Box
              className="toggle-panel toggle-right"
              sx={{
                position: 'absolute',
                width: '50%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '0 30px',
                textAlign: 'center',
                top: 0,
                right: 0,
                transform: 'translateX(0)',
                transition: 'all 0.6s ease-in-out'
              }}
            >
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold', color: 'white' }}>
                Welcome to Task Manager
              </Typography>
              <Typography variant="body1" sx={{ 
                fontSize: '14px', 
                lineHeight: '20px', 
                letterSpacing: '0.3px', 
                margin: '20px 0', 
                paddingLeft: '55px',
                color: 'white' 
              }}>
                Register with your personal details to use all of site features
              </Typography>
              <Button
                id="register"
                onClick={() => setIsActive(true)}
                className="button-85"
                sx={{
                  position: 'relative',
                  padding: '0.6em 2em',
                  border: 'none',
                  outline: 'none',
                  color: 'rgb(255, 255, 255)',
                  backgroundColor: '#111',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  zIndex: 0,
                  '&:before': {
                    content: '""',
                    background: 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    backgroundSize: '400%',
                    zIndex: -1,
                    filter: 'blur(5px)',
                    width: 'calc(100% + 4px)',
                    height: 'calc(100% + 4px)',
                    animation: 'glowing-button-85 20s linear infinite',
                    transition: 'opacity 0.3s ease-in-out',
                    borderRadius: '10px'
                  },
                  '&:after': {
                    zIndex: -1,
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#222',
                    left: 0,
                    top: 0,
                    borderRadius: '10px'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes glowing-button-85 {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 400% 0;
          }
          100% {
            background-position: 0 0;
          }
        }
        
        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
      `}</style>
    </Box>
  );
};

export default Login;