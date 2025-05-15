import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async get(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    const response = await axiosInstance.get(url);
    return response.data;
  }

  async getById(id) {
    const response = await axiosInstance.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await axiosInstance.post(this.endpoint, data);
    return response.data;
  }

  async update(id, data) {
    const response = await axiosInstance.patch(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    await axiosInstance.delete(`${this.endpoint}/${id}`);
    return id;
  }

  // Special methods for file upload
  async uploadFile(formData) {
    const response = await axiosInstance.post(this.endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default BaseService; 