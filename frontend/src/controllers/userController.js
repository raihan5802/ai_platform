// src/controllers/userController.js
import { getDashboard } from '../api/user';

export const fetchUser = async () => {
  try {
    const data = await getDashboard();
    return data.user;
  } catch (error) {
    throw error;
  }
};
