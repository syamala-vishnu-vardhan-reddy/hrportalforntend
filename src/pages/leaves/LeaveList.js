import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { getLeaves, updateLeaveStatus } from '../../redux/slices/leaveSlice';

function LeaveList() {
  const dispatch = useDispatch();
  const { leaves, loading } = useSelector((state) => state.leave);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getLeaves());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusUpdate = async (id, status) => {
    await dispatch(updateLeaveStatus({ id, status }));
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pending' },
      approved: { color: 'success', label: 'Approved' },
      rejected: { color: 'error', label: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'employeeName', headerName: 'Employee', width: 180 },
    { field: 'type', headerName: 'Leave Type', width: 130 },
    { field: 'startDate', headerName: 'Start Date', width: 130 },
    { field: 'endDate', headerName: 'End Date', width: 130 },
    { field: 'reason', headerName: 'Reason', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          {params.row.status === 'pending' && (
            <>
              <IconButton
                color="success"
                onClick={() => handleStatusUpdate(params.row.id, 'approved')}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleStatusUpdate(params.row.id, 'rejected')}
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
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Leave Requests</Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/leaves/request'}
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

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredLeaves}
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

export default LeaveList; 