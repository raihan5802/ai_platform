// src/components/Dashboard/CreateRequestModal.js
import React from 'react';
import { Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const CreateRequestModal = ({ open, handleClose, formData, handleChange, handleSubmit }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Request
        </Typography>
        <TextField
          label="Description"
          name="description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          style={{ marginBottom: 15 }}
        />
        <TextField
          label="Special Requirements"
          name="specialRequirements"
          fullWidth
          value={formData.specialRequirements}
          onChange={handleChange}
          style={{ marginBottom: 15 }}
        />
        <FormControl fullWidth style={{ marginBottom: 15 }}>
          <InputLabel>Delivery Type</InputLabel>
          <Select name="deliveryType" value={formData.deliveryType} onChange={handleChange}>
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Express">Express</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Submit Request
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateRequestModal;
