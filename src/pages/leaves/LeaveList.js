import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getLeaves, updateLeaveStatus } from "../../redux/slices/leaveSlice";

function LeaveList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaves, loading, error } = useSelector((state) => state.leave);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log("Fetching leaves...");
    dispatch(getLeaves());
  }, [dispatch, refreshKey]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateLeaveStatus({ id, status })).unwrap();
      console.log(`Leave ${id} status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "warning", label: "Pending" },
      approved: { color: "success", label: "Approved" },
      rejected: { color: "error", label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "employeeName", headerName: "Employee", width: 180 },
    { field: "type", headerName: "Leave Type", width: 130 },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    { field: "reason", headerName: "Reason", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          {params.row.status === "pending" && (
            <>
              <IconButton
                color="success"
                onClick={() => handleStatusUpdate(params.row.id, "approved")}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleStatusUpdate(params.row.id, "rejected")}
              >
                <CloseIcon />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const filteredLeaves = leaves.filter((leave) =>
    Object.values(leave).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Leave Requests</Typography>
        <Box>
          <Tooltip title="View mock data directly">
            <Button
              variant="outlined"
              startIcon={<ViewListIcon />}
              onClick={() => navigate("/leaves/mock")}
              sx={{ mr: 2 }}
            >
              View Mock Data
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/leaves/request")}
          >
            Request Leave
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search leave requests..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {leaves.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No leave requests found. Click "Refresh" to try again or "Request
          Leave" to create a new request.
        </Alert>
      )}

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredLeaves}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id}
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {loading
                    ? "Loading leave requests..."
                    : "No leave requests found"}
                </Typography>
              </Box>
            ),
          }}
        />
      </Paper>
    </Box>
  );
}

export default LeaveList;
