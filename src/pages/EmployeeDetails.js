import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useParams } from 'react-router-dom';

const EmployeeDetails = () => {
  const { id } = useParams();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Details
        </Typography>
        <Typography variant="body1">
          Employee ID: {id}
        </Typography>
        {/* Employee details will be added here */}
      </Box>
    </Container>
  );
};

export default EmployeeDetails; 