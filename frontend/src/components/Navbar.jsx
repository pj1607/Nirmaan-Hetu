import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout(); // your logout function from context
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  let menuItems = [];
  if (!isLoggedIn) {
    menuItems = [
      { label: 'Home', path: '/', icon: <HomeIcon /> },
      { label: 'Login', path: '/login', icon: <LoginIcon /> },
    ];
  } else {
    if (role === 'owner') {
      menuItems = [
        { label: 'Dashboard', path: '/owner-dashboard', icon: <DashboardIcon /> },
      ];
    } else if (role === 'builder') {
      menuItems = [
        { label: 'Dashboard', path: '/builder-dashboard', icon: <DashboardIcon /> },
      ];
    }
    menuItems.push({ label: 'Logout', action: handleLogout, icon: <LoginIcon /> });
  }

  return (
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
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
          {menuItems.map((item) =>
            item.action ? (
              <Button
                key={item.label}
                onClick={item.action}
                disabled={loading}
                sx={{
                  color: '#000000ff',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { color: '#FF7A5A' },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  color: '#000000ff',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { color: '#FF7A5A'},
                }}
              >
                {item.label}
              </Button>
            )
          )}
        </Box>

        {/* Mobile Icons */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
          {menuItems.map((item) =>
            item.action ? (
              <Tooltip title={item.label} key={item.label}>
                <IconButton
                  onClick={item.action}
                  disabled={loading}
                  sx={{
                    color: '#000000ff',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { color: '#FF7A5A' },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    item.icon || <LoginIcon />
                  )}
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={item.label} key={item.label}>
                <IconButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: '#000000ff',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { color: '#FF7A5A'},
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
