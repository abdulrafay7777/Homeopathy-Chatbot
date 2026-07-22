import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';

// Set up an Axios instance for your future custom backend
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Network Errors gracefully (e.g. backend is restarting)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      toast.error('Server is unreachable. Please wait...', { id: 'network-error' });
      return Promise.reject(error);
    }
    
    // Handle true 401 Unauthorized (token expired or truly invalid)
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    
    return Promise.reject(error);
  }
);
