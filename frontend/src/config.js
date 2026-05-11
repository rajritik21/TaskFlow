const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || 'https://taskflow-gmhe.onrender.com'
    : 'http://localhost:5001';

export default API_BASE_URL;