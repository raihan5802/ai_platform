// src/controllers/requestsController.js
import { getRequests, createRequest, deleteRequest, updateRequest } from '../api/requests';

export const fetchRequests = async () => {
  try {
    const data = await getRequests();
    return data;
  } catch (error) {
    throw error;
  }
};

export const addRequest = async (requestData) => {
  try {
    const data = await createRequest(requestData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeRequest = async (requestId) => {
  try {
    const data = await deleteRequest(requestId);
    return data;
  } catch (error) {
    throw error;
  }
};

export const modifyRequest = async (requestId, updateData) => {
  try {
    const data = await updateRequest(requestId, updateData);
    return data;
  } catch (error) {
    throw error;
  }
};
