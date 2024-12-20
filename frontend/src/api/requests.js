// src/api/requests.js
import API from '../services/apiInstance';

export const getRequests = async () => {
  try {
    const response = await API.get('/requests');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createRequest = async (requestData) => {
  try {
    const response = await API.post('/requests', requestData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteRequest = async (requestId) => {
  try {
    const response = await API.delete(`/requests/${requestId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateRequest = async (requestId, updateData) => {
  try {
    const response = await API.put(`/requests/${requestId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
