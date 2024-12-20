import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Backend URL
});

// If you have a token, attach it to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;