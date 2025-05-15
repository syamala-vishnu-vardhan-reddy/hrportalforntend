import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getAttendance = async () => {
  const response = await axios.get(`${API_URL}/attendance`);
  return response.data;
};

export const markAttendance = async (data) => {
  const response = await axios.post(`${API_URL}/attendance`, data);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axios.put(`${API_URL}/attendance/${id}`, data);
  return response.data;
}; 