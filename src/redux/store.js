import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from './slices/attendanceSlice';
import documentReducer from './slices/documentSlice';
import authReducer from './slices/authSlice';
import leaveReducer from './slices/leaveSlice';
import employeeReducer from './slices/employeeSlice';
import payrollReducer from './slices/payrollSlice';
import performanceReducer from './slices/performanceSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    document: documentReducer,
    auth: authReducer,
    leave: leaveReducer,
    employee: employeeReducer,
    payroll: payrollReducer,
    performance: performanceReducer,
    dashboard: dashboardReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
