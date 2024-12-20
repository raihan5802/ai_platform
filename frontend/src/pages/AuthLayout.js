// src/pages/AuthLayout.js
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Paper
      elevation={6}
      style={{
        padding: '30px',
        borderRadius: '12px',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(255,255,255,0.8)',
        position: 'relative',
      }}
    >
      <Box textAlign="center" mb={2}>
        <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
          AI Annotation Platform
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Harness the Power of Data
        </Typography>
      </Box>
      {children}
    </Paper>
  );
};

export default AuthLayout;
