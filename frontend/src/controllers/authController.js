// src/controllers/authController.js
import { signup, signin } from '../api/auth';

export const handleSignup = async (userData) => {
  try {
    const data = await signup(userData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleSignin = async (credentials) => {
  try {
    const data = await signin(credentials);
    return data;
  } catch (error) {
    throw error;
  }
};
