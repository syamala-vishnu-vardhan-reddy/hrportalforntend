import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import mockEmployees from "../../mockData/employees";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Async thunks
export const getEmployees = createAsyncThunk(
  "employee/getEmployees",
  async (_, { rejectWithValue }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await delay(500);

        // Transform mock employees to match the expected format in the component
        const formattedEmployees = mockEmployees.map((employee) => ({
          id: employee.id,
          firstName: employee.first_name,
          lastName: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          position: employee.position,
          joinDate: employee.hire_date,
          status: employee.status,
          profileImage: employee.profile_image,
          salary: employee.salary,
        }));

        console.log("Using mock employee data:", formattedEmployees);
        return formattedEmployees;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

export const getEmployee = createAsyncThunk(
  "employee/getEmployee",
  async (id, { rejectWithValue }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await delay(300);

        // Find the employee in our mock data
        const employee = mockEmployees.find((emp) => emp.id === parseInt(id));

        if (!employee) {
          return rejectWithValue("Employee not found");
        }

        // Format it to match the component's expected format
        const formattedEmployee = {
          id: employee.id,
          firstName: employee.first_name,
          lastName: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          position: employee.position,
          joinDate: employee.hire_date,
          status: employee.status,
          profileImage: employee.profile_image,
          salary: employee.salary,
        };

        console.log("Using mock employee data for ID:", id, formattedEmployee);
        return formattedEmployee;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employee"
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await delay(700);

        // Create a new employee with mock data
        const newEmployee = {
          id: Math.floor(Math.random() * 1000) + 100,
          firstName: employeeData.firstName || employeeData.first_name,
          lastName: employeeData.lastName || employeeData.last_name,
          email: employeeData.email,
          phone: employeeData.phone || "123-456-7890",
          department: employeeData.department,
          position: employeeData.position,
          joinDate:
            employeeData.joinDate ||
            employeeData.hire_date ||
            new Date().toISOString().split("T")[0],
          status: employeeData.status || "active",
          profileImage:
            employeeData.profileImage ||
            `https://randomuser.me/api/portraits/${
              Math.random() > 0.5 ? "men" : "women"
            }/${Math.floor(Math.random() * 100)}.jpg`,
          salary: employeeData.salary || 50000,
        };

        console.log("Created new employee:", newEmployee);
        return newEmployee;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/employees`,
          employeeData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create employee"
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ id, ...employeeData }, { rejectWithValue, getState }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await delay(500);

        // Get current employee from state
        const currentEmployee = getState().employee.employees.find(
          (emp) => emp.id === parseInt(id)
        );

        if (!currentEmployee) {
          return rejectWithValue("Employee not found");
        }

        // Create an updated employee object
        const updatedEmployee = {
          ...currentEmployee,
          ...employeeData,
          id: parseInt(id),
        };

        console.log("Updated employee:", updatedEmployee);
        return updatedEmployee;
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${API_URL}/employees/${id}`,
          employeeData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee"
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue, getState }) => {
    try {
      // Check if we should use mock data (for development without backend)
      const useMockData = true; // Set to true to use mock data

      if (useMockData) {
        // Simulate API delay
        await delay(500);

        // Check if the employee exists
        const employeeExists = getState().employee.employees.some(
          (emp) => emp.id === parseInt(id)
        );

        if (!employeeExists) {
          return rejectWithValue("Employee not found");
        }

        console.log("Deleted employee with ID:", id);
        return parseInt(id);
      } else {
        // Real API call
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return id;
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee"
      );
    }
  }
);

const initialState = {
  employees: [],
  employee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEmployee: (state) => {
      state.employee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Employees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Employee
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
        state.employees = state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        );
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
