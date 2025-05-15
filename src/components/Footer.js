import React from "react";
import { Box, Container, Typography, Link, Grid, Divider } from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              HR Portal
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              A comprehensive HR management system for modern organizations.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>
              <Link href="#" color="inherit">
                <Twitter />
              </Link>
              <Link href="#" color="inherit">
                <LinkedIn />
              </Link>
              <Link href="#" color="inherit">
                <Instagram />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link
              href="/dashboard"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Dashboard
            </Link>
            <Link
              href="/employees"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Employees
            </Link>
            <Link href="/leaves" color="inherit" display="block" sx={{ mb: 1 }}>
              Leave Management
            </Link>
            <Link
              href="/attendance"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Attendance
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Link href="/help" color="inherit" display="block" sx={{ mb: 1 }}>
              Help Center
            </Link>
            <Link href="/faq" color="inherit" display="block" sx={{ mb: 1 }}>
              FAQ
            </Link>
            <Link
              href="/privacy"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
              Terms of Service
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">
                123 HR Street, Business District
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">+1 (555) 123-4567</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Email sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">support@hrportal.com</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2">
            &copy; {currentYear} HR Portal. All rights reserved.
          </Typography>
          <Box>
            <Link href="/privacy" color="inherit" sx={{ mr: 2 }}>
              <Typography variant="body2">Privacy</Typography>
            </Link>
            <Link href="/terms" color="inherit">
              <Typography variant="body2">Terms</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
