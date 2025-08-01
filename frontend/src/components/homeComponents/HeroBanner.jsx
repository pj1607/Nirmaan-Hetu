import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';


const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        background: 'linear-gradient(145deg, #202020ff 30%, #1f1f1f 70%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }}
    >
      {/* Colorful House SVG */}
      <Box
        component="svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.5,
          transform: 'scale(1.3)',
          zIndex: 1,
        }}
      >
        {/* Base */}
        <rect x="300" y="550" width="400" height="300" fill="#e55c36ff" />
        {/* Roof */}
        <polygon points="280,550 500,400 720,550" fill="#E64833" />
        {/* Door */}
        <rect x="460" y="670" width="80" height="180" fill="#fff8" />
        {/* Windows */}
        <rect x="340" y="600" width="60" height="60" fill="#ffffff55" />
        <rect x="600" y="600" width="60" height="60" fill="#ffffff55" />
        {/* Chimney */}
        <rect x="560" y="420" width="30" height="70" fill="#fff4" />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'right',
          color: '#fff',
          p: { xs: 3, md: 6 },
          maxWidth: '600px',
        }}
      >
        
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', md: '3.8rem' },
            background: 'linear-gradient(to right, #FF7A5A, #BF3F2C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Nirmaan Hetu
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: '#e0d0c0',
          }}
        >
          Match with builders who meet your dreams — and your demands.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: 'bold',
            bgcolor: '#FF7A5A',
            color: '#1c0f0f',
            '&:hover': {
              bgcolor: '#ff7a5aca',
               transform: 'scale(1.03)',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default HeroBanner;
