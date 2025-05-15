import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { leaves as mockLeaves } from "../../mockData/leaves";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Action Creators
export const fetchLeavesStart = createAction("leave/fetchStart");
export const fetchLeavesSuccess = createAction("leave/fetchSuccess");
export const fetchLeavesFailure = createAction("leave/fetchFailure");

export const fetchMyLeavesStart = createAction("leave/fetchMyAttendanceStart");
export const fetchMyLeavesSuccess = createAction(
  "leave/fetchMyAttendanceSuccess"
);
export const fetchMyLeavesFailure = createAction(
  "leave/fetchMyAttendanceFailure"
);

export const applyLeaveStart = createAction("leave/applyStart");
export const applyLeaveSuccess = createAction("leave/applySuccess");
export const applyLeaveFailure = createAction("leave/applyFailure");

export const updateLeaveStart = createAction("leave/updateStart");
export const updateLeaveSuccess = createAction("leave/updateSuccess");
export const updateLeaveFailure = createAction("leave/updateFailure");

export const updateLeaveStatusStart = createAction("leave/updateStatusStart");
export const updateLeaveStatusSuccess = createAction(
  "leave/updateStatusSuccess"
);
export const updateLeaveStatusFailure = createAction(
  "leave/updateStatusFailure"
);

// Async Thunks
export const getLeaves = createAsyncThunk(
  "leave/getLeaves",
  async (_, { rejectWithValue }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Transform mock leaves to match the expected format in the component
        const formattedLeaves = mockLeaves.map((leave) => ({
          id: leave.id,
          employeeName: leave.employee_name,
          type: leave.leave_type,
          startDate: leave.start_date,
          endDate: leave.end_date,
          days: leave.days,
          reason: leave.reason,
          status: leave.status,
          createdAt: leave.created_at,
        }));

        console.log("Using mock leave data:", formattedLeaves);
        return formattedLeaves;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/leaves`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
  }
);

export const createLeave = createAsyncThunk(
  "leave/createLeave",
  async (leaveData, { rejectWithValue }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Create a new leave with mock data
        const newLeave = {
          id: Math.floor(Math.random() * 1000) + 100,
          employeeName: leaveData.employee_name || "Current User",
          type: leaveData.leave_type,
          startDate: leaveData.start_date,
          endDate: leaveData.end_date,
          days: leaveData.days || 1,
          reason: leaveData.reason,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        console.log("Created new leave:", newLeave);
        return newLeave;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/leaves`, leaveData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error creating leave:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create leave request"
      );
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  "leave/updateStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Find the leave in our mock data
        const leaveIndex = mockLeaves.findIndex((leave) => leave.id === id);

        if (leaveIndex === -1) {
          return rejectWithValue("Leave not found");
        }

        // Create an updated leave object
        const updatedLeave = {
          ...mockLeaves[leaveIndex],
          status: status,
        };

        // Format it to match the component's expected format
        const formattedLeave = {
          id: updatedLeave.id,
          employeeName: updatedLeave.employee_name,
          type: updatedLeave.leave_type,
          startDate: updatedLeave.start_date,
          endDate: updatedLeave.end_date,
          days: updatedLeave.days,
          reason: updatedLeave.reason,
          status: status,
          createdAt: updatedLeave.created_at,
        };

        console.log("Updated leave status:", formattedLeave);
        return formattedLeave;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${API_URL}/leaves/${id}/status`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update leave status"
      );
    }
  }
);

export const deleteLeave = createAsyncThunk(
  "leave/deleteLeave",
  async (id, { rejectWithValue }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if the leave exists
        const leaveExists = mockLeaves.some((leave) => leave.id === id);

        if (!leaveExists) {
          return rejectWithValue("Leave not found");
        }

        console.log("Deleted leave with ID:", id);
        return id;
      } else {
        // Real API call
        await axios.delete(`${API_URL}/leaves/${id}`);
        return id;
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete leave"
      );
    }
  }
);

const initialState = {
  leaves: [],
  myLeaves: [],
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Leaves
      .addCase(getLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(getLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Leave
      .addCase(createLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.push(action.payload);
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Leave Status
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = state.leaves.map((leave) =>
          leave.id === action.payload.id ? action.payload : leave
        );
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Leave
      .addCase(deleteLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = state.leaves.filter(
          (leave) => leave.id !== action.payload
        );
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = leaveSlice.actions;
export default leaveSlice.reducer;
