import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack
} from '@mui/material';

const DashboardB = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#1c0f0f', minHeight: '100vh' }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: '#f1e0d6',
          textAlign: 'center',
          mb: 4,
          background: 'linear-gradient(to right, #e9b87e, #944c2f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Builder Dashboard
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              backgroundColor: '#2e1a18',
              color: '#f1e0d6',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Upload Project Portfolio
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Showcase your best work to potential owners. Add images, location, budget & more.
            </Typography>
            <Button variant="contained" sx={{
              bgcolor: '#E89B4A',
              color: '#1c0f0f',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e89c4ac9' },
            }}>
              Upload Now
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              backgroundColor: '#2e1a18',
              color: '#f1e0d6',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Incoming Owner Requests
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              View and manage owner project requests. Accept, reject or message them.
            </Typography>
            <Button variant="contained" sx={{
              bgcolor: '#E89B4A',
              color: '#1c0f0f',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e89c4ac9' },
            }}>
              View Requests
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Profile Section */}
      <Paper
        elevation={4}
        sx={{
          mt: 5,
          p: 3,
          backgroundColor: '#2e1a18',
          color: '#f1e0d6',
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Your Profile
        </Typography>
        <Stack spacing={1}>
          <Typography>Name: <strong>Builder Name</strong></Typography>
          <Typography>Email: <strong>builder@email.com</strong></Typography>
          <Typography>Experience: <strong>5+ years</strong></Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DashboardB;
