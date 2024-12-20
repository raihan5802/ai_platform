// src/components/Auth/SignUp.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleSignup } from '../../controllers/authController';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSignup(formData);
      alert('Account created successfully. Please sign in.');
      navigate('/signin');
    } catch (error) {
      alert(error.error || 'Sign-up failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <PersonAddIcon color="primary" style={{ marginRight: '8px' }} />
        <Typography variant="h5" fontWeight="bold">
          Sign Up
        </Typography>
      </Box>
      <TextField
        label="Name"
        name="name"
        fullWidth
        onChange={handleChange}
        required
        style={{ marginBottom: '15px' }}
      />
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
        Sign Up
      </Button>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Already have an account?{' '}
          <a
            href="/signin"
            style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}
          >
            Sign In
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
