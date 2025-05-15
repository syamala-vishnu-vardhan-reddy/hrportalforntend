import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

// Mock data
const mockAttendanceRecords = [
  {
    id: 1,
    date: "2023-05-01",
    employeeId: 1,
    employeeFirstName: "John",
    employeeLastName: "Doe",
    check_in_time: "2023-05-01T09:00:00",
    check_out_time: "2023-05-01T17:00:00",
    status: "present",
    notes: "",
  },
  {
    id: 2,
    date: "2023-05-02",
    employeeId: 1,
    employeeFirstName: "John",
    employeeLastName: "Doe",
    check_in_time: "2023-05-02T09:15:00",
    check_out_time: "2023-05-02T17:30:00",
    status: "late",
    notes: "Traffic delay",
  },
  {
    id: 3,
    date: "2023-05-03",
    employeeId: 1,
    employeeFirstName: "John",
    employeeLastName: "Doe",
    check_in_time: "2023-05-03T08:45:00",
    check_out_time: "2023-05-03T16:50:00",
    status: "present",
    notes: "",
  },
  {
    id: 4,
    date: "2023-05-01",
    employeeId: 2,
    employeeFirstName: "Jane",
    employeeLastName: "Smith",
    check_in_time: "2023-05-01T08:50:00",
    check_out_time: "2023-05-01T17:05:00",
    status: "present",
    notes: "",
  },
  {
    id: 5,
    date: "2023-05-02",
    employeeId: 2,
    employeeFirstName: "Jane",
    employeeLastName: "Smith",
    check_in_time: null,
    check_out_time: null,
    status: "absent",
    notes: "Sick leave",
  },
];

const AttendanceList = () => {
  // Mock user data
  const user = { role: "admin" };

  const [records, setRecords] = useState(mockAttendanceRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // In a real app, we would dispatch the action to fetch attendance records
    // dispatch(fetchAttendanceStart());
    setRecords(mockAttendanceRecords);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = () => {
    let filteredRecords = [...mockAttendanceRecords];

    if (startDate) {
      filteredRecords = filteredRecords.filter(
        (record) => new Date(record.date) >= startDate
      );
    }

    if (endDate) {
      filteredRecords = filteredRecords.filter(
        (record) => new Date(record.date) <= endDate
      );
    }

    if (employeeFilter) {
      filteredRecords = filteredRecords.filter((record) =>
        `${record.employeeFirstName} ${record.employeeLastName}`
          .toLowerCase()
          .includes(employeeFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredRecords = filteredRecords.filter(
        (record) => record.status === statusFilter
      );
    }

    setRecords(filteredRecords);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setEmployeeFilter("");
    setStatusFilter("");
    setRecords(mockAttendanceRecords);
  };

  const getStatusChip = (status) => {
    let color = "default";

    switch (status) {
      case "present":
        color = "success";
        break;
      case "absent":
        color = "error";
        break;
      case "late":
        color = "warning";
        break;
      default:
        color = "default";
    }

    return <Chip label={status} color={color} size="small" />;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

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
              Attendance Records
            </Typography>
            <Button
              component={Link}
              to="/attendance/check"
              variant="contained"
              color="primary"
            >
              Check In/Out
            </Button>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              {(user.role === "admin" || user.role === "hr") && (
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Employee"
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                    fullWidth
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="present">Present</MenuItem>
                    <MenuItem value="absent">Absent</MenuItem>
                    <MenuItem value="late">Late</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Box display="flex" gap={1}>
                  <Button variant="contained" onClick={handleFilter}>
                    Filter
                  </Button>
                  <Button variant="outlined" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Attendance Table */}
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    {(user.role === "admin" || user.role === "hr") && (
                      <TableCell>Employee</TableCell>
                    )}
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        {(user.role === "admin" || user.role === "hr") && (
                          <TableCell>
                            {record.employeeFirstName} {record.employeeLastName}
                          </TableCell>
                        )}
                        <TableCell>
                          {formatTime(record.check_in_time)}
                        </TableCell>
                        <TableCell>
                          {formatTime(record.check_out_time)}
                        </TableCell>
                        <TableCell>{getStatusChip(record.status)}</TableCell>
                        <TableCell>{record.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  {records.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          user.role === "admin" || user.role === "hr" ? 6 : 5
                        }
                      >
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttendanceList;
