import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MailOutline, LockOutlined, PersonOutline } from '@mui/icons-material';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(`http://localhost:5001${endpoint}`, payload);
      
      // Assume the API returns { token, user }
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Enter your details to access your workspace.' : 'Sign up to start managing your projects.'}
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '12px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: 'var(--danger)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <PersonOutline style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                className="modern-input" 
                style={{ paddingLeft: '48px' }}
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <MailOutline style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              className="modern-input" 
              style={{ paddingLeft: '48px' }}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <LockOutlined style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="modern-input" 
              style={{ paddingLeft: '48px' }}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="modern-btn modern-btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
