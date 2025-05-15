import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mockUsers from "../../mockData/users";

// Helper function to generate a mock token
const generateMockToken = (userId) => {
  return `mock-token-${userId}-${Date.now()}`;
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Initialize with token if it exists
const token = localStorage.getItem("token");

// Mock login function
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find user by email and check password
      const user = mockUsers.find(
        (user) =>
          user.email === credentials.email &&
          user.password === credentials.password
      );

      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      // Create a copy of user without the password
      const { password, ...userWithoutPassword } = user;

      // Generate a mock token
      const token = generateMockToken(user.id);
      localStorage.setItem("token", token);

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

// Mock register function
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if email already exists
      const existingUser = mockUsers.find(
        (user) => user.email === userData.email
      );
      if (existingUser) {
        return rejectWithValue("Email already in use");
      }

      // Create a new user (in a real app, this would be saved to the database)
      const newUser = {
        id: mockUsers.length + 1,
        username: userData.username || userData.email.split("@")[0],
        email: userData.email,
        password: userData.password,
        role: "employee",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        department: userData.department || "",
        position: userData.position || "",
        phone: userData.phone || "",
        hire_date: new Date().toISOString().split("T")[0],
        profile_image: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 100)}.jpg`,
      };

      // In a real app, we would add the user to the database
      // For this mock, we'll just pretend it was added

      // Create a copy of user without the password
      const { password, ...userWithoutPassword } = newUser;

      // Generate a mock token
      const token = generateMockToken(newUser.id);
      localStorage.setItem("token", token);

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

// Mock get profile function
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      // Extract user ID from token (in a real app, you would decode the JWT)
      const userId = parseInt(token.split("-")[2]);

      // Find user by ID
      const user = mockUsers.find((user) => user.id === userId);
      if (!user) {
        return rejectWithValue("User not found");
      }

      // Create a copy of user without the password
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue("Failed to fetch profile");
    }
  }
);

// Mock update profile function
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue, getState }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      // Get current user from state
      const currentUser = getState().auth.user;
      if (!currentUser) {
        return rejectWithValue("User not found");
      }

      // Update user data (in a real app, this would update the database)
      const updatedUser = {
        ...currentUser,
        ...userData,
      };

      return updatedUser;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

// Mock logout function
export const logout = createAsyncThunk("auth/logout", async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  localStorage.removeItem("token");
  setAuthToken(null);
});

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  isAuthenticated: false,
  profileFetched: false, // Flag to track if profile has been fetched
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.profileFetched = true; // Mark profile as fetched
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.profileFetched = false; // Reset profile fetched flag
        localStorage.removeItem("token");
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.profileFetched = false; // Reset profile fetched flag on logout
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
