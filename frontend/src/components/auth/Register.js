import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page since we have a combined login/register interface now
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Register;