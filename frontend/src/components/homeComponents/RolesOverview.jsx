import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Fade,
  Paper,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SearchIcon from '@mui/icons-material/Search';
import BalanceIcon from '@mui/icons-material/Balance';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import ConstructionIcon from '@mui/icons-material/Construction';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

const roles = [
  {
    label: 'Owners',
    icon: <AccountCircleIcon fontSize="large" />,
    points: [
      { icon: <SearchIcon sx={{ color: '#FF7A5A' }} />, text: 'Explore builder portfolios' },
      { icon: <BalanceIcon sx={{ color: '#FF7A5A' }} />, text: 'Compare using AI suggestions' },
      { icon: <BarChartIcon sx={{ color: '#FF7A5A' }} />, text: 'Track budget and progress in real-time' },
    ],
  },
  {
    label: 'Builders',
    icon: <HomeWorkIcon fontSize="large" />,
    points: [
      { icon: <FolderCopyIcon sx={{ color: '#FF7A5A' }} />, text: 'Upload your project portfolio' },
      { icon: <ConstructionIcon sx={{ color: '#FF7A5A' }} />, text: 'Showcase your best work' },
      { icon: <ConnectWithoutContactIcon sx={{ color: '#FF7A5A' }} />, text: 'Connect with interested owners' },
    ],
  },
];

const RolesOverview = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ py: 10, px: { xs: 2, sm: 4 } }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          mb: 6,
          background: 'linear-gradient(to right, #FF7A5A, #BF3F2C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Who Can Use Nirmaan Hetu?
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            color: '#f1e0d6',
          },
          '& .Mui-selected': {
            color: '#FF7A5A',
          },
        }}
      >
        {roles.map((role, i) => (
          <Tab
            key={i}
            label={role.label}
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
            }}
          />
        ))}
      </Tabs>

      <Fade in timeout={400}>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            maxWidth: 600,
            mx: 'auto',
            textAlign: 'center',
            backgroundColor: '#2d2d2d',
            color: '#f1e0d6',
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#414040ff',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
            }}
          >
            {roles[activeTab].icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {roles[activeTab].label}
          </Typography>

          <Box sx={{ textAlign: 'left' }}>
            {roles[activeTab].points.map((point, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
              >
                <Box sx={{ mr: 1 }}>{point.icon}</Box>
                <Typography variant="body1" sx={{ color: '#d8c7b2' }}>
                  {point.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default RolesOverview;
