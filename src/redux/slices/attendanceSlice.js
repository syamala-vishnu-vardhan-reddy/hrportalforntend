import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Action Creators
export const fetchAttendanceStart = createAction("attendance/fetchStart");
export const fetchAttendanceSuccess = createAction("attendance/fetchSuccess");
export const fetchAttendanceFailure = createAction("attendance/fetchFailure");

export const fetchMyAttendanceStart = createAction(
  "attendance/fetchMyAttendanceStart"
);
export const fetchMyAttendanceSuccess = createAction(
  "attendance/fetchMyAttendanceSuccess"
);
export const fetchMyAttendanceFailure = createAction(
  "attendance/fetchMyAttendanceFailure"
);

export const checkInStart = createAction("attendance/checkInStart");
export const checkInSuccess = createAction("attendance/checkInSuccess");
export const checkInFailure = createAction("attendance/checkInFailure");

export const checkOutStart = createAction("attendance/checkOutStart");
export const checkOutSuccess = createAction("attendance/checkOutSuccess");
export const checkOutFailure = createAction("attendance/checkOutFailure");

export const updateAttendanceStart = createAction("attendance/updateStart");
export const updateAttendanceSuccess = createAction("attendance/updateSuccess");
export const updateAttendanceFailure = createAction("attendance/updateFailure");

export const getAttendanceRecords = createAsyncThunk(
  "attendance/getRecords",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/attendance/check-in`,
        data,
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

export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/attendance/check-out`,
        data,
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

export const updateAttendanceAction = createAsyncThunk(
  "attendance/updateAttendance",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/attendance/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update attendance"
      );
    }
  }
);

const initialState = {
  records: [],
  todayRecord: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Records
      .addCase(getAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records;
        state.todayRecord = action.payload.todayRecord;
      })
      .addCase(getAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.todayRecord = action.payload;
        state.records.push(action.payload);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.todayRecord = action.payload;
        state.records = state.records.map((record) =>
          record.id === action.payload.id ? action.payload : record
        );
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Attendance
      .addCase(updateAttendanceStart, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendanceSuccess, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (record) => record.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(updateAttendanceFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = attendanceSlice.actions;

export default attendanceSlice.reducer;
