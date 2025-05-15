import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Divider,
  Alert,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AttendanceCheck = () => {
  // Mock user data
  const user = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    role: "employee",
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  // Mock attendance data
  const [todayAttendance, setTodayAttendance] = useState({
    date: new Date().toISOString().split("T")[0],
    check_in_time: null,
    check_out_time: null,
    status: null,
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCheckIn = () => {
    const checkInTime = new Date();

    // Determine if late (after 9:00 AM)
    const workStartHour = 9;
    const isLate =
      checkInTime.getHours() > workStartHour ||
      (checkInTime.getHours() === workStartHour &&
        checkInTime.getMinutes() > 0);

    // In a real app, we would dispatch an action to check in
    // dispatch(checkInStart({ notes: notes }));

    setTodayAttendance({
      ...todayAttendance,
      check_in_time: checkInTime.toISOString(),
      status: isLate ? "late" : "present",
    });

    setStatus("success");
    setMessage(
      `Successfully checked in at ${formatTime(checkInTime)}${
        isLate ? " (Late)" : ""
      }`
    );
  };

  const handleCheckOut = () => {
    const checkOutTime = new Date();

    // In a real app, we would dispatch an action to check out
    // dispatch(checkOutStart({ notes: notes }));

    setTodayAttendance({
      ...todayAttendance,
      check_out_time: checkOutTime.toISOString(),
      notes: notes,
    });

    setStatus("success");
    setMessage(`Successfully checked out at ${formatTime(checkOutTime)}`);
  };

  const isCheckedIn = todayAttendance.check_in_time !== null;
  const isCheckedOut = todayAttendance.check_out_time !== null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Attendance Check
            </Typography>
            <Button component={Link} to="/attendance" variant="outlined">
              View Attendance Records
            </Button>
          </Box>

          {status && (
            <Alert
              severity={status}
              sx={{ mb: 3 }}
              onClose={() => setStatus(null)}
            >
              {message}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <AccessTimeIcon
                    sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h3" gutterBottom>
                    {formatTime(currentTime)}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {formatDate(currentTime)}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Welcome, {user.firstName} {user.lastName}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Today's Attendance
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Check In:</Typography>
                      <Typography variant="body1">
                        {isCheckedIn
                          ? formatTime(new Date(todayAttendance.check_in_time))
                          : "Not checked in yet"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Check Out:</Typography>
                      <Typography variant="body1">
                        {isCheckedOut
                          ? formatTime(new Date(todayAttendance.check_out_time))
                          : "Not checked out yet"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Status:</Typography>
                      <Typography
                        variant="body1"
                        color={
                          todayAttendance.status === "present"
                            ? "success.main"
                            : todayAttendance.status === "late"
                            ? "warning.main"
                            : "text.primary"
                        }
                      >
                        {todayAttendance.status || "Not recorded"}
                      </Typography>
                    </Grid>

                    {!isCheckedOut && isCheckedIn && (
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                          label="Notes (optional)"
                          multiline
                          rows={2}
                          fullWidth
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes about today's work"
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {!isCheckedIn ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleCheckIn}
                    >
                      Check In
                    </Button>
                  ) : !isCheckedOut ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handleCheckOut}
                    >
                      Check Out
                    </Button>
                  ) : (
                    <Button variant="outlined" disabled fullWidth>
                      Checked Out for Today
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttendanceCheck;
