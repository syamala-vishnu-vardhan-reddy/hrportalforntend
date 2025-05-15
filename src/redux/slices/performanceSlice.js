import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

// API endpoint for performance
const ENDPOINT = "/performance";

// Async thunks
export const fetchPerformances = createAsyncThunk(
  "performance/fetchPerformances",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINT);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch performances"
      );
    }
  }
);

export const fetchEmployeePerformance = createAsyncThunk(
  "performance/fetchEmployeePerformance",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${ENDPOINT}/my-reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee performance"
      );
    }
  }
);

export const createPerformanceReview = createAsyncThunk(
  "performance/createPerformanceReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINT, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create performance review"
      );
    }
  }
);

export const updatePerformanceReview = createAsyncThunk(
  "performance/updatePerformanceReview",
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${ENDPOINT}/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update performance review"
      );
    }
  }
);

const initialState = {
  performances: [],
  employeePerformance: [],
  loading: false,
  error: null,
};

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all performances
      .addCase(fetchPerformances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformances.fulfilled, (state, action) => {
        state.loading = false;
        state.performances = action.payload;
      })
      .addCase(fetchPerformances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch performances";
      })
      // Fetch employee performance
      .addCase(fetchEmployeePerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeePerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePerformance = action.payload;
      })
      .addCase(fetchEmployeePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch employee performance";
      })
      // Create performance review
      .addCase(createPerformanceReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPerformanceReview.fulfilled, (state, action) => {
        state.loading = false;
        state.performances.push(action.payload);
      })
      .addCase(createPerformanceReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create performance review";
      })
      // Update performance review
      .addCase(updatePerformanceReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePerformanceReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.performances.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.performances[index] = action.payload;
        }
      })
      .addCase(updatePerformanceReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update performance review";
      });
  },
});

export const { clearError } = performanceSlice.actions;
export default performanceSlice.reducer;
