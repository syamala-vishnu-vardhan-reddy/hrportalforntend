import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service methods
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response;
};

export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData);
  return response;
};

export const logout = async () => {
  localStorage.removeItem("token");
  const response = await api.post("/auth/logout");
  return response;
};

// Export all methods as a service object for backward compatibility
const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  logout,
};

export default authService;
