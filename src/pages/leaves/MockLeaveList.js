import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { leaves as mockLeaves } from "../../mockData/leaves";

function MockLeaveList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [leaves, setLeaves] = useState(mockLeaves);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusUpdate = (id, status) => {
    setLeaves(
      leaves.map((leave) => (leave.id === id ? { ...leave, status } : leave))
    );
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

  const filteredLeaves = leaves.filter((leave) =>
    Object.values(leave).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Mock Leave Requests</Typography>
        <Button
          variant="contained"
          onClick={() => (window.location.href = "/leaves/request")}
        >
          Request Leave
        </Button>
      </Box>

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

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.id}</TableCell>
                  <TableCell>{leave.employee_name}</TableCell>
                  <TableCell>{leave.leave_type}</TableCell>
                  <TableCell>{leave.start_date}</TableCell>
                  <TableCell>{leave.end_date}</TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{getStatusChip(leave.status)}</TableCell>
                  <TableCell>
                    {leave.status === "pending" && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleStatusUpdate(leave.id, "approved")
                          }
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleStatusUpdate(leave.id, "rejected")
                          }
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default MockLeaveList;
