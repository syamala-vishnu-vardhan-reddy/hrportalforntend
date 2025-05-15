import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { getDashboardStats } from '../../redux/slices/dashboardSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves || 0,
      icon: <EventNoteIcon sx={{ fontSize: 40 }} />,
      color: '#dc004e',
    },
    {
      title: 'Performance Reviews',
      value: stats?.pendingReviews || 0,
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Today\'s Attendance',
      value: stats?.todayAttendance || 0,
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: card.color,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4">
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leave Requests
              </Typography>
              <List>
                {stats?.recentLeaves?.map((leave, index) => (
                  <React.Fragment key={leave.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${leave.employeeName} - ${leave.type}`}
                        secondary={`${leave.startDate} to ${leave.endDate}`}
                      />
                    </ListItem>
                    {index < stats.recentLeaves.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Performance Reviews
              </Typography>
              <List>
                {stats?.upcomingReviews?.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ListItem>
                      <ListItemText
                        primary={review.employeeName}
                        secondary={`Due: ${review.dueDate}`}
                      />
                    </ListItem>
                    {index < stats.upcomingReviews.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 