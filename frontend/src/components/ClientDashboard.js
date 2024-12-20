import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    description: '',
    specialRequirements: '',
    deliveryType: 'Regular',
  });
  const [sortBy, setSortBy] = useState('id'); // Sorting state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get('/dashboard');
        setUser(userRes.data.user);

        const requestsRes = await API.get('/requests');
        setRequests(requestsRes.data.requests || []);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/signin');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleInputChange = (e) => {
    setNewRequest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitRequest = async () => {
    try {
      const payload = {
        description: newRequest.description,
        special_requirements: newRequest.specialRequirements,
        delivery_type: newRequest.deliveryType,
      };

      const res = await API.post('/requests', payload);
      setRequests((prev) => [res.data.request, ...prev]);
      setNewRequest({ description: '', specialRequirements: '', deliveryType: 'Regular' });
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create request.');
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);

    const sortedRequests = [...requests];
    switch (e.target.value) {
      case 'id':
        sortedRequests.sort((a, b) => a.id - b.id);
        break;
      case 'status':
        sortedRequests.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'date':
        sortedRequests.sort((a, b) => new Date(a.estimated_delivery_date) - new Date(b.estimated_delivery_date));
        break;
      default:
        break;
    }
    setRequests(sortedRequests);
  };

  if (!user) return (
    <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {user.name}'s Client Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3} flexGrow={1} overflow="auto">
        <Typography variant="h5" gutterBottom>Welcome, {user.name}!</Typography>
        <Typography variant="body1" gutterBottom>Your email: {user.email}</Typography>

        <Box mt={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" gutterBottom>Your Requests</Typography>
            <Box display="flex" alignItems="center">
              <FormControl style={{ width: 200, marginRight: 16 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} onChange={handleSortChange}>
                  <MenuItem value="id">Request ID</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                  <MenuItem value="date">Estimated Delivery Date</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleModalOpen}>
                Create Request
              </Button>
            </Box>
          </Box>

          {requests.length === 0 ? (
            <Typography variant="body2">No requests found.</Typography>
          ) : (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Special Requirements</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Delivery Type</TableCell>
                    <TableCell>Estimated Delivery Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.id}</TableCell>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>{req.special_requirements || 'N/A'}</TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>{req.delivery_type}</TableCell>
                      <TableCell>{req.estimated_delivery_date || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Modal for creating a new request */}
      <Modal open={openModal} onClose={handleModalClose}>
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
          <Typography variant="h6" gutterBottom>Create a New Request</Typography>
          <TextField
            label="Description"
            name="description"
            fullWidth
            value={newRequest.description}
            onChange={handleInputChange}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Special Requirements"
            name="specialRequirements"
            fullWidth
            value={newRequest.specialRequirements}
            onChange={handleInputChange}
            style={{ marginBottom: 15 }}
          />
          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel>Delivery Type</InputLabel>
            <Select
              name="deliveryType"
              value={newRequest.deliveryType}
              onChange={handleInputChange}
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Express">Express</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSubmitRequest} fullWidth>
            Submit Request
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ClientDashboard;
