import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/payrolls`
  : "/api/payrolls";

// Action Creators
export const fetchPayrollsStart = () => ({
  type: "payroll/fetchPayrollsStart",
});
export const fetchPayrollsSuccess = (data) => ({
  type: "payroll/fetchPayrollsSuccess",
  payload: data,
});
export const fetchPayrollsFailure = (error) => ({
  type: "payroll/fetchPayrollsFailure",
  payload: error,
});

export const fetchMyPayrollsStart = () => ({
  type: "payroll/fetchMyPayrollsStart",
});
export const fetchMyPayrollsSuccess = (data) => ({
  type: "payroll/fetchMyPayrollsSuccess",
  payload: data,
});
export const fetchMyPayrollsFailure = (error) => ({
  type: "payroll/fetchMyPayrollsFailure",
  payload: error,
});

export const generatePayrollStart = () => ({
  type: "payroll/generatePayrollStart",
});
export const generatePayrollSuccess = (data) => ({
  type: "payroll/generatePayrollSuccess",
  payload: data,
});
export const generatePayrollFailure = (error) => ({
  type: "payroll/generatePayrollFailure",
  payload: error,
});

export const updatePayrollStart = () => ({
  type: "payroll/updatePayrollStart",
});
export const updatePayrollSuccess = (data) => ({
  type: "payroll/updatePayrollSuccess",
  payload: data,
});
export const updatePayrollFailure = (error) => ({
  type: "payroll/updatePayrollFailure",
  payload: error,
});

// Async Thunks
export const fetchPayrolls = createAsyncThunk(
  "payroll/fetchPayrolls",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}?month=${month}&year=${year}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEmployeePayroll = createAsyncThunk(
  "payroll/fetchEmployeePayroll",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee payroll"
      );
    }
  }
);

export const generatePayroll = createAsyncThunk(
  "payroll/generatePayroll",
  async (payrollData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, payrollData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePayroll = createAsyncThunk(
  "payroll/updatePayroll",
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  payrolls: [],
  employeePayroll: [],
  loading: false,
  error: null,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payrolls
      .addCase(fetchPayrolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.loading = false;
        state.payrolls = action.payload;
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch payrolls";
      })
      // Fetch Employee Payroll
      .addCase(fetchEmployeePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePayroll = action.payload;
      })
      .addCase(fetchEmployeePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate Payroll
      .addCase(generatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payrolls.push(action.payload);
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to generate payroll";
      })
      // Update Payroll
      .addCase(updatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayroll.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payrolls.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.payrolls[index] = action.payload;
        }
      })
      .addCase(updatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update payroll";
      });
  },
});

export const { clearError } = payrollSlice.actions;

export default payrollSlice.reducer;
