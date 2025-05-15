import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  People,
  EventNote,
  AccessTime,
  AttachMoney,
} from '@mui/icons-material';
import { fetchLeaves } from '../redux/slices/leaveSlice';
import { fetchAttendance } from '../redux/slices/attendanceSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      bgcolor: `${color}.light`,
      color: `${color}.dark`,
    }}
  >
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="h6" component="div">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Paper>
);

function Dashboard() {
  const dispatch = useDispatch();
  const { leaves, loading: leavesLoading } = useSelector((state) => state.leave);
  const { attendance, loading: attendanceLoading } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    dispatch(fetchLeaves());
    dispatch(fetchAttendance());
  }, [dispatch]);

  if (leavesLoading || attendanceLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const stats = {
    totalEmployees: 150, // This would come from your API
    pendingLeaves: leaves?.filter((leave) => leave.status === 'pending')?.length || 0,
    presentToday: attendance?.filter((record) => record.status === 'present')?.length || 0,
    monthlyPayroll: '$45,000', // This would come from your API
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon={<EventNote />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={<AccessTime />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Payroll"
            value={stats.monthlyPayroll}
            icon={<AttachMoney />}
            color="info"
          />
        </Grid>
      </Grid>
      {/* Add more dashboard content like charts and tables here */}
    </Box>
  );
}

export default Dashboard; 