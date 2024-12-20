// src/components/Auth/SignIn.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleSignin } from '../../controllers/authController';
import LoginIcon from '@mui/icons-material/Login';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleSignin(formData);
      localStorage.setItem('token', res.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.error || 'Sign-in failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <LoginIcon color="primary" style={{ marginRight: '8px' }} />
        <Typography variant="h5" fontWeight="bold">
          Sign In
        </Typography>
      </Box>
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        onChange={handleChange}
        required
        style={{ marginBottom: '15px' }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        onChange={handleChange}
        required
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" fullWidth type="submit">
        Sign In
      </Button>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <a
            href="/signup"
            style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}
          >
            Sign Up
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;
