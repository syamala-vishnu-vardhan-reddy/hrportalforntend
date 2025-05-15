import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Employee Pages
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeProfile from './pages/employees/EmployeeProfile';

// Leave Management
import LeaveList from './pages/leaves/LeaveList';
import LeaveRequest from './pages/leaves/LeaveRequest';

// Performance Management
import PerformanceList from './pages/performance/PerformanceList';
import PerformanceReview from './pages/performance/PerformanceReview';

// Attendance
import AttendanceList from './pages/attendance/AttendanceList';
import AttendanceCheck from './pages/attendance/AttendanceCheck';

// Documents
import DocumentList from './pages/documents/DocumentList';
import DocumentUpload from './pages/documents/DocumentUpload';

// Payroll
import PayrollList from './pages/payroll/PayrollList';
import PayrollDetails from './pages/payroll/PayrollDetails';

// Profile
import Profile from './pages/profile/Profile';

// Not Found
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Protected Route component
  const ProtectedRoute = ({ children, roles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user?.role)) {
      return <Navigate to="/dashboard" />;
    }

    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employee Routes */}
            <Route
              path="employees"
              element={
                <ProtectedRoute roles={['admin', 'hr']}>
                  <EmployeeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="employees/:id"
              element={
                <ProtectedRoute roles={['admin', 'hr']}>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />

            {/* Leave Routes */}
            <Route path="leaves" element={<LeaveList />} />
            <Route path="leaves/request" element={<LeaveRequest />} />

            {/* Performance Routes */}
            <Route path="performance" element={<PerformanceList />} />
            <Route path="performance/:id" element={<PerformanceReview />} />

            {/* Attendance Routes */}
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="attendance/check" element={<AttendanceCheck />} />

            {/* Document Routes */}
            <Route path="documents" element={<DocumentList />} />
            <Route path="documents/upload" element={<DocumentUpload />} />

            {/* Payroll Routes */}
            <Route
              path="payroll"
              element={
                <ProtectedRoute roles={['admin', 'hr']}>
                  <PayrollList />
                </ProtectedRoute>
              }
            />
            <Route
              path="payroll/:id"
              element={
                <ProtectedRoute roles={['admin', 'hr']}>
                  <PayrollDetails />
                </ProtectedRoute>
              }
            />

            {/* Profile Route */}
            <Route path="profile" element={<Profile />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

