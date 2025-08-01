import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Login', path: '/login', icon: <LoginIcon /> },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          px: { xs: 2, md: 4 },
          py: 1,
        }}
      >
        <Toolbar
          sx={{
            background: '#ffffffff',

            borderRadius: '40px',
            width: '100%',
            maxWidth: '1500px',
            mx: 'auto',
            py: 1,
            px: 2,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
        {/* Logo and Title */}
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.08)',
    },
  }}
  onClick={() => navigate('/')}
>
  {/* Logo Image */}
  <Box
    component="img"
    src={logo}
    alt="Logo"
    sx={{
      height: 42,
      filter: 'invert(1) contrast(150%)',
      transition: 'filter 0.3s ease-in-out',
    }}
  />
</Box>


          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  color: '#000000ff',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem', 
                   transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    color: '#FF7A5A',
                  transform: 'scale(1.08)'
                },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Icons */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {menuItems.map((item) => (
              <Tooltip title={item.label} key={item.label}>
                <IconButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: '#000000ff',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { color: '#FF7A5A',transform: 'scale(1.08)' },
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
