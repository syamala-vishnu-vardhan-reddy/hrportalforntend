import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

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
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createLeave = createAsyncThunk(
  "leave/createLeave",
  async (leaveData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/leaves`, leaveData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  "leave/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/leaves/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteLeave = createAsyncThunk(
  "leave/deleteLeave",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/leaves/${id}`);
      return id;
    } catch (error) {
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
