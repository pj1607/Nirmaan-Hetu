import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ConstructionIcon from '@mui/icons-material/Construction';

const steps = [
  {
    icon: <SmartToyIcon sx={{ fontSize: 48, color: '#FF7A5A',transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                }, }} />,
    title: 'AI Chat Assistant',
    desc: 'Instantly get tips on agreements, floor plans, and smart choices.',
  },
  {
    icon: <HomeWorkIcon sx={{ fontSize: 48, color: '#FF7A5A', transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },}} />,
    title: 'Portfolios & Designs',
    desc: 'See builder portfolios, real samples, and ready-to-build ideas.',
  },
  {
    icon: <PeopleAltIcon sx={{ fontSize: 48, color: '#FF7A5A' ,transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },}} />,
    title: 'Smart Builder Match',
    desc: 'We connect you with suitable builders using AI analysis.',
  },
  {
    icon: <ConstructionIcon sx={{ fontSize: 48, color: '#FF7A5A' ,transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },}} />,
    title: 'Build with Confidence',
    desc: 'Manage your project with ease, from sketch to keys.',
  },
];

const FeaturesWorkflow = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        px: { xs: 3, md: 12 },
        py: { xs: 8, md: 14 },
        color: '#f1e0d6',
        overflow: 'hidden',
      }}
    >

      {/* New Section Heading */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          mt:-3,
          mb: 10,
          background: 'linear-gradient(to right, #FF7A5A, #BF3F2C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Visualize Your Dream Home Journey
      </Typography>

      {/* Workflow steps */}
      <Box
        sx={{
          mb: -5,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 8,
          position: 'relative',
        }}
      >
      
        {steps.map((step, idx) => (
          <Box
            key={idx}
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: isMobile ? 'left' : 'center',
              maxWidth: 250,
            }}
          >
            <Box sx={{ mb: 2 }}>{step.icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
              {step.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#d8c7b2' }}>
              {step.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturesWorkflow;
