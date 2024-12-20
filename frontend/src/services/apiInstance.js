// src/services/apiInstance.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend's URL and port
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
