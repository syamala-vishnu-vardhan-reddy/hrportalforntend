import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getLeaves = async () => {
  const response = await axios.get(`${API_URL}/leaves`);
  return response.data;
};

export const applyLeave = async (data) => {
  const response = await axios.post(`${API_URL}/leaves`, data);
  return response.data;
};

export const updateLeave = async (id, data) => {
  const response = await axios.put(`${API_URL}/leaves/${id}`, data);
  return response.data;
}; 