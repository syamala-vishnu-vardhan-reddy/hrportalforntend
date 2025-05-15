import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getEmployees, deleteEmployee } from "../../redux/slices/employeeSlice";

function EmployeeList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector((state) => state.employee);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log("Fetching employees...");
    dispatch(getEmployees());
  }, [dispatch, refreshKey]);

  // Log the current employees from Redux store for debugging
  useEffect(() => {
    console.log("Current employees in Redux store:", employees);
  }, [employees]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleAddEmployee = () => {
    navigate("/employees/new");
  };

  const handleEditEmployee = (id) => {
    navigate(`/employees/${id}`);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        console.log(`Employee ${id} deleted successfully`);
      } catch (error) {
        console.error("Failed to delete employee:", error);
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "department", headerName: "Department", width: 130 },
    { field: "position", headerName: "Position", width: 130 },
    { field: "joinDate", headerName: "Join Date", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEditEmployee(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteEmployee(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Employees</Typography>
        <Box>
          <Tooltip title="View mock data directly">
            <Button
              variant="outlined"
              startIcon={<ViewListIcon />}
              onClick={() => navigate("/employees/mock")}
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
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
          >
            Add Employee
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
          placeholder="Search employees..."
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

      {employees.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No employees found. Click "Refresh" to try again or "Add Employee" to
          create a new employee.
        </Alert>
      )}

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredEmployees}
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
                  {loading ? "Loading employees..." : "No employees found"}
                </Typography>
              </Box>
            ),
          }}
        />
      </Paper>
    </Box>
  );
}

export default EmployeeList;
