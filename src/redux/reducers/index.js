import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import leaveReducer from '../slices/leaveSlice';
import attendanceReducer from '../slices/attendanceSlice';
import payrollReducer from '../slices/payrollSlice';
import performanceReducer from '../slices/performanceSlice';
import documentReducer from '../slices/documentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  leave: leaveReducer,
  attendance: attendanceReducer,
  payroll: payrollReducer,
  performance: performanceReducer,
  document: documentReducer,
});

export default rootReducer; 