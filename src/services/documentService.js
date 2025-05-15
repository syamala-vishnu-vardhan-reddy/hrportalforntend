import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get all documents (admin/HR only)
export const getDocuments = async (filter) => {
  let url = `${API_URL}/documents`;
  if (filter) {
    const params = new URLSearchParams();
    if (filter.type) params.append("type", filter.type);
    if (filter.status) params.append("status", filter.status);
    if (params.toString()) url += `?${params.toString()}`;
  }
  const response = await axios.get(url);
  return response;
};

// Get employee's documents
export const getMyDocuments = async () => {
  const response = await axios.get(`${API_URL}/documents/my-documents`);
  return response;
};

// Upload document
export const uploadDocument = async (formData) => {
  const response = await axios.post(`${API_URL}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// Update document
export const updateDocument = async (id, data) => {
  const response = await axios.patch(`${API_URL}/documents/${id}`, data);
  return response;
};

// Verify document (admin/HR only)
export const verifyDocument = async (id) => {
  const response = await axios.post(`${API_URL}/documents/${id}/verify`);
  return response;
};

// Delete document
export const deleteDocument = async (id) => {
  const response = await axios.delete(`${API_URL}/documents/${id}`);
  return response;
};

// Get document statistics (admin/HR only)
export const getDocumentStats = async () => {
  const response = await axios.get(`${API_URL}/documents/stats/overview`);
  return response;
};
