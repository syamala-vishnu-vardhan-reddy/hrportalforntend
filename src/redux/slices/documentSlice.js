import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Async Thunks
export const fetchDocuments = createAsyncThunk(
  "document/fetchDocuments",
  async (filter, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/documents`;
      if (filter) {
        const params = new URLSearchParams();
        if (filter.type) params.append("type", filter.type);
        if (filter.status) params.append("status", filter.status);
        if (params.toString()) url += `?${params.toString()}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch documents"
      );
    }
  }
);

export const fetchMyDocuments = createAsyncThunk(
  "document/fetchMyDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/documents/my-documents`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my documents"
      );
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "document/uploadDocument",
  async (documentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/documents`, documentData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload document"
      );
    }
  }
);

export const updateDocument = createAsyncThunk(
  "document/updateDocument",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/documents/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update document"
      );
    }
  }
);

export const verifyDocument = createAsyncThunk(
  "document/verifyDocument",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/documents/${id}/verify`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify document"
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "document/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/documents/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete document"
      );
    }
  }
);

export const fetchDocumentStats = createAsyncThunk(
  "document/fetchDocumentStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/documents/stats/overview`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch document statistics"
      );
    }
  }
);

// Actions
export const fetchDocumentsStart = createAction('documents/fetchStart');
export const fetchDocumentsSuccess = createAction('documents/fetchSuccess');
export const fetchDocumentsFailure = createAction('documents/fetchFailure');

export const fetchMyDocumentsStart = createAction('documents/fetchMyStart');
export const fetchMyDocumentsSuccess = createAction('documents/fetchMySuccess');
export const fetchMyDocumentsFailure = createAction('documents/fetchMyFailure');

export const uploadDocumentStart = createAction('documents/uploadStart');
export const uploadDocumentSuccess = createAction('documents/uploadSuccess');
export const uploadDocumentFailure = createAction('documents/uploadFailure');

export const deleteDocumentStart = createAction('documents/deleteStart');
export const deleteDocumentSuccess = createAction('documents/deleteSuccess');
export const deleteDocumentFailure = createAction('documents/deleteFailure');

const initialState = {
  documents: [],
  myDocuments: [],
  stats: null,
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchDocumentsStart, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsSuccess, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocumentsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Documents
      .addCase(fetchMyDocumentsStart, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDocumentsSuccess, (state, action) => {
        state.loading = false;
        state.myDocuments = action.payload;
      })
      .addCase(fetchMyDocumentsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Document
      .addCase(uploadDocumentStart, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocumentSuccess, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
        state.myDocuments.push(action.payload);
      })
      .addCase(uploadDocumentFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Document
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Update in both arrays
        const index = state.documents.findIndex(
          (doc) => doc._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }

        const myIndex = state.myDocuments.findIndex(
          (doc) => doc._id === action.payload._id
        );
        if (myIndex !== -1) {
          state.myDocuments[myIndex] = action.payload;
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Document
      .addCase(verifyDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Update in both arrays
        const index = state.documents.findIndex(
          (doc) => doc._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }

        const myIndex = state.myDocuments.findIndex(
          (doc) => doc._id === action.payload._id
        );
        if (myIndex !== -1) {
          state.myDocuments[myIndex] = action.payload;
        }
      })
      .addCase(verifyDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Document
      .addCase(deleteDocumentStart, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocumentSuccess, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
        state.myDocuments = state.myDocuments.filter(
          (doc) => doc._id !== action.payload
        );
      })
      .addCase(deleteDocumentFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Document Stats
      .addCase(fetchDocumentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDocumentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = documentSlice.actions;

export default documentSlice.reducer;
