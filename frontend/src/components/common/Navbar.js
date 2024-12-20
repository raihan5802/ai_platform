// src/components/common/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ user, onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {user ? `${user.name}'s Client Dashboard` : 'AI Annotation Platform'}
        </Typography>
        {user && (
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
