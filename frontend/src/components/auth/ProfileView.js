import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Edit, CameraAlt, Save, Close } from '@mui/icons-material';

const ProfileView = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState({ username: '', email: '', profilePicture: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Updating...', type: 'info' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/api/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      login(token, res.data);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Error updating profile', type: 'error' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: 'Updating...', type: 'info' });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPwdMessage({ text: 'New passwords do not match', type: 'error' });
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPwdMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPwdMessage({ text: error.response?.data?.message || 'Error changing password', type: 'error' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Image size must be less than 2MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="view-header">
        <h1 className="view-title heading-gradient">My Profile</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Profile Information</h2>
            {!isEditing && (
              <button 
                className="modern-btn modern-btn-secondary" 
                onClick={() => setIsEditing(true)}
                style={{ padding: '8px 16px' }}
              >
                <Edit fontSize="small" /> Edit Profile
              </button>
            )}
          </div>
          
          {message.text && (
            <div style={{ 
              color: message.type === 'error' ? 'var(--danger)' : message.type === 'success' ? 'var(--success)' : 'var(--info)',
              marginBottom: '16px'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: profileData.profilePicture ? `url(${profileData.profilePicture}) center/cover` : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: 'var(--shadow-md)',
                  opacity: isEditing ? 0.8 : 1,
                  transition: 'opacity 0.3s'
                }}
              >
                {!profileData.profilePicture && (profileData.username?.[0]?.toUpperCase() || 'U')}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)'
                  }}
                  title="Upload Photo"
                >
                  <CameraAlt fontSize="small" />
                </button>
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleImageUpload}
              />
            </div>

            <div style={{ flex: 1 }}>
              {isEditing ? (
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label>Username</label>
                    <input 
                      type="text" 
                      className="modern-input" 
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      className="modern-input" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" className="modern-btn modern-btn-primary"><Save fontSize="small" /> Save</button>
                    <button 
                      type="button" 
                      className="modern-btn modern-btn-secondary" 
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          username: user?.username || '',
                          email: user?.email || '',
                          profilePicture: user?.profilePicture || ''
                        });
                        setMessage({text:'', type:''});
                      }}
                    >
                      <Close fontSize="small" /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Username</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{user?.username}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Email</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{user?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pwdMessage.text && (
              <div style={{ color: pwdMessage.type === 'error' ? 'var(--danger)' : pwdMessage.type === 'success' ? 'var(--success)' : 'var(--info)' }}>
                {pwdMessage.text}
              </div>
            )}
            
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                className="modern-input" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                className="modern-input" 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                className="modern-input" 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                minLength="6"
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="modern-btn modern-btn-secondary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
