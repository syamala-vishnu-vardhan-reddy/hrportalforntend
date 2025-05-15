import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getPerformance = async () => {
  const response = await axios.get(`${API_URL}/performance`);
  return response.data;
};

export const submitReview = async (data) => {
  const response = await axios.post(`${API_URL}/performance/review`, data);
  return response.data;
};

export const updatePerformance = async (id, data) => {
  const response = await axios.put(`${API_URL}/performance/${id}`, data);
  return response.data;
}; 