import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Set up an Axios instance for your future custom backend
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add request/response interceptors here later for auth tokens