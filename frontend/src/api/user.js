// src/api/user.js
import API from '../services/apiInstance';

export const getDashboard = async () => {
  try {
    const response = await API.get('/dashboard');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
