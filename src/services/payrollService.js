import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getPayroll = async () => {
  const response = await axios.get(`${API_URL}/payroll`);
  return response.data;
};

export const generatePayroll = async (data) => {
  const response = await axios.post(`${API_URL}/payroll/generate`, data);
  return response.data;
};

export const updatePayroll = async (id, data) => {
  const response = await axios.put(`${API_URL}/payroll/${id}`, data);
  return response.data;
}; 