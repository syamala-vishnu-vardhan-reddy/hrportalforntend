import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

const AuthFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" align="center">
          &copy; {currentYear} HR Portal. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center">
          <Link color="inherit" href="/privacy">
            Privacy
          </Link>{" "}
          &bull;{" "}
          <Link color="inherit" href="/terms">
            Terms
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default AuthFooter;
