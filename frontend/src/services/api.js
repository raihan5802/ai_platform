import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Change if your backend is at a different URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
