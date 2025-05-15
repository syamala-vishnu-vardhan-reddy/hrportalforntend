import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createLeave } from "../../redux/slices/leaveSlice";
import { leaveTypes } from "../../mockData/leaves";

function LeaveRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    employee_id: user?.id || 1,
    employee_name: user
      ? `${user.first_name} ${user.last_name}`
      : "Current User",
    days: 0,
  });

  // Calculate days between start and end date
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

      setFormData((prev) => ({
        ...prev,
        days: diffDays,
      }));
    }
  }, [formData.start_date, formData.end_date]);

  // Available leave types from our mock data
  const availableLeaveTypes = leaveTypes.map((type) => type.name);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();

      if (startDate < today) {
        alert("Start date cannot be in the past");
        return;
      }

      if (endDate < startDate) {
        alert("End date cannot be before start date");
        return;
      }

      console.log("Submitting leave request:", formData);
      const result = await dispatch(createLeave(formData)).unwrap();
      console.log("Leave request created:", result);
      navigate("/leaves");
    } catch (err) {
      console.error("Failed to create leave request:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Request Leave
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Leave Type"
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                required
              >
                {availableLeaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Days"
                name="days"
                type="number"
                value={formData.days}
                InputProps={{ readOnly: true }}
                helperText="Automatically calculated based on start and end dates"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/leaves")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default LeaveRequest;
