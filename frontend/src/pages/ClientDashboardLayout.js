import React from 'react';
import { Box } from '@mui/material';

const ClientDashboardLayout = ({ children }) => {
  return (
    <Box className="fullscreen-container">
      {children}
    </Box>
  );
};

export default ClientDashboardLayout;
