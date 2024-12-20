// src/api/auth.js
import API from '../services/apiInstance';

export const signup = async (userData) => {
  try {
    const response = await API.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const signin = async (credentials) => {
  try {
    const response = await API.post('/auth/signin', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
