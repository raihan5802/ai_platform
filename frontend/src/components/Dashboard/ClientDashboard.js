// src/components/Dashboard/ClientDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import CreateRequestModal from './CreateRequestModal';
import { fetchRequests, addRequest } from '../../controllers/requestsController';
import { fetchUser } from '../../controllers/userController';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    description: '',
    specialRequirements: '',
    deliveryType: 'Regular',
  });
  const [sortBy, setSortBy] = useState('id');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetchUser();
        setUser(userRes);

        // Fetch requests
        const requestsData = await fetchRequests();
        setRequests(requestsData.requests || []);
        setLoading(false);
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

      const res = await addRequest(payload);
      setRequests((prev) => [res.request, ...prev]);
      setNewRequest({ description: '', specialRequirements: '', deliveryType: 'Regular' });
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert(err.error || 'Failed to create request.');
    }
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);

    const sortedRequests = [...requests];
    switch (selectedSort) {
      case 'id':
        sortedRequests.sort((a, b) => a.id - b.id);
        break;
      case 'status':
        sortedRequests.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'date':
        sortedRequests.sort((a, b) => {
          const dateA = a.estimated_delivery_date ? new Date(a.estimated_delivery_date) : new Date(0);
          const dateB = b.estimated_delivery_date ? new Date(b.estimated_delivery_date) : new Date(0);
          return dateA - dateB;
        });
        break;
      default:
        break;
    }
    setRequests(sortedRequests);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <Navbar user={user} onLogout={handleLogout} />

      <Box p={3} flexGrow={1} overflow="auto">
        <Typography variant="h5" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your email: {user.email}
        </Typography>

        <Box mt={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" gutterBottom>
              Your Requests
            </Typography>
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

      {/* Create Request Modal */}
      <CreateRequestModal
        open={openModal}
        handleClose={handleModalClose}
        formData={newRequest}
        handleChange={handleInputChange}
        handleSubmit={handleSubmitRequest}
      />
    </Box>
  );
};

export default ClientDashboard;
