import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  useTheme,  Tabs,
  Tab,
  Avatar,
  Fade,
} from '@mui/material';

import CompareIcon from '@mui/icons-material/Compare';
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


const steps = [
  {
    label: 'Builder Uploads Portfolio',
    description: 'Builders showcase past work, pricing, and specialties.',
    icon: <HomeWorkIcon sx={{ fontSize: 48, color: '#FF7A5A' }} />,
  },
  {
    label: 'Owner Compares & Shortlists',
    description: 'Owners evaluate based on budget, needs, and AI insights.',
    icon: <CompareIcon sx={{ fontSize: 48, color: '#FF7A5A' }} />,
  },
  {
    label: 'Agreement & Execution',
    description: 'Construction begins after agreement and confirmation.',
    icon: <ConstructionIcon sx={{ fontSize: 48, color: '#FF7A5A' }} />,
  },
];

const WorkflowSteps = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Box
      sx={{
        py: 12,
        px: { xs: 3, sm: 6, md: 10 },
        color: '#e0d0c0',
        position: 'relative',
   background: 'linear-gradient(145deg, #1c1c1cff 30%, #1f1f1f 70%)',
        clipPath: 'polygon(0 10%,100% 0, 100% 100%, 0 100%)',
      }}
    >
     
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{
          mt:16,
          mb: 8,
          zIndex: 1,
          position: 'relative',
          background: 'linear-gradient(to right, #FF7A5A, #BF3F2C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        How Nirmaan Hetu Works?
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={6}
        justifyContent="center"
        alignItems="center"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {steps.map((step, i) => (
         <Paper
  key={i}
  elevation={4}
  sx={{
    p: 4,
    maxWidth: 300,
    textAlign: 'center',
    bgcolor: '#2d2d2d',
    borderRadius: 4,
    color: '#e0d0c0',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.0)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    },
  }}
>

            <Box mb={2}>{step.icon}</Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {step.label}
            </Typography>
            <Divider
              sx={{
                mb: 2,
                bgcolor: '#FF7A5A',
                height: 2,
                width: '50%',
                mx: 'auto',
              }}
            />
            <Typography variant="body2" color="#d8c7b2">
              {step.description}
            </Typography>
          </Paper>
        ))}
      </Stack>
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
    </Box>
    
  );
};


export default WorkflowSteps;
