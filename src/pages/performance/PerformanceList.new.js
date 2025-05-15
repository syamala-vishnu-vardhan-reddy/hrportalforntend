import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

// Mock data for performance reviews
const mockReviews = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Doe",
    reviewerId: "2",
    reviewerName: "Jane Smith",
    reviewPeriod: "2023 Q1",
    overallRating: 4,
    status: "completed",
    createdAt: "2023-03-31T00:00:00.000Z",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Jane Smith",
    reviewerId: "3",
    reviewerName: "Michael Johnson",
    reviewPeriod: "2023 Q1",
    overallRating: 3.5,
    status: "completed",
    createdAt: "2023-03-30T00:00:00.000Z",
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "Michael Johnson",
    reviewerId: "1",
    reviewerName: "John Doe",
    reviewPeriod: "2023 Q1",
    overallRating: 4.5,
    status: "in-progress",
    createdAt: "2023-03-29T00:00:00.000Z",
  },
];

function PerformanceList() {
  // Use mock data instead of Redux state
  const [loading, setLoading] = useState(false);
  const reviews = mockReviews;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // For now, we're using mock data
    setLoading(false);
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "warning", label: "Pending" },
      in_progress: { color: "info", label: "In Progress" },
      completed: { color: "success", label: "Completed" },
      overdue: { color: "error", label: "Overdue" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "employeeName", headerName: "Employee", width: 180 },
    { field: "reviewerName", headerName: "Reviewer", width: 180 },
    { field: "period", headerName: "Review Period", width: 130 },
    { field: "dueDate", headerName: "Due Date", width: 130 },
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
          <IconButton
            color="primary"
            onClick={() =>
              (window.location.href = `/performance/${params.row.id}`)
            }
          >
            {params.row.status === "completed" ? <ViewIcon /> : <EditIcon />}
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredReviews = reviews.filter((review) =>
    Object.values(review).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Performance Reviews</Typography>
        <Button
          variant="contained"
          onClick={() => (window.location.href = "/performance/new")}
        >
          New Review
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search performance reviews..."
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

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredReviews}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>
    </Box>
  );
}

export default PerformanceList;
