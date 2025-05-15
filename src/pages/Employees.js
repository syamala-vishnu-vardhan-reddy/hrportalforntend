import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Employees = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employees
        </Typography>
        {/* Employee list will be added here */}
      </Box>
    </Container>
  );
};

export default Employees; 