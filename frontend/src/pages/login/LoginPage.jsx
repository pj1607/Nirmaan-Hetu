import React, { useState } from 'react';
import {
  Box,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Login from '../../components/loginComponents/Login';
import Register from '../../components/loginComponents/Register';
import { AnimatePresence, motion } from 'framer-motion';

const fadeVariant = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.2 },
};

const LoginPage = () => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: isMobile ? 'center' : 'flex-start', 
        justifyContent: 'center',
        px: 2,
        py: 4,
        position: 'relative',
        background: 'linear-gradient(145deg, #202020 30%, #1f1f1f 70%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <svg
        viewBox="0 0 1000 900"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.08,
        }}
      >
        <g fill="#E89B4A" stroke="#E89B4A" strokeWidth="0.5">
          <rect x="300" y="550" width="400" height="300" fill="#e55c36ff" />
          <polygon points="280,550 500,400 720,550" fill="#E64833" />
          <rect x="460" y="670" width="80" height="180" fill="#fff8" />
          <rect x="340" y="600" width="60" height="60" fill="#ffffff55" />
          <rect x="600" y="600" width="60" height="60" fill="#ffffff55" />
          <rect x="560" y="420" width="30" height="70" fill="#fff4" />
        </g>
      </svg>

      {/* Main Box */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          minHeight: isMobile ? '85vh' : 500,
          px: isMobile ? 0 : 6,
          py: isMobile ? 0 : 5,
          zIndex: 1,
        }}
      >
        {/* Icon Switcher */}
        <Stack
          spacing={2}
          sx={{
            position: 'absolute',
            top: 90,
            right: 20,
            zIndex: 2,
            alignItems: 'center',
          }}
        >
          <Tooltip title="Login" placement="left">
            <motion.div
              whileHover={{ scale: 1.2, color: '#E89B4A' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(0)}
              style={{
                cursor: 'pointer',
                color: tab === 0 ? '#E89B4A' : '#fff',
                fontSize: '28px',
              }}
            >
              <LoginIcon fontSize="inherit" />
            </motion.div>
          </Tooltip>

          <Tooltip title="Register" placement="left">
            <motion.div
              whileHover={{ scale: 1.2, color: '#E89B4A' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(1)}
              style={{
                cursor: 'pointer',
                color: tab === 1 ? '#E89B4A' : '#fff',
                fontSize: '28px',
              }}
            >
              <AppRegistrationIcon fontSize="inherit" />
            </motion.div>
          </Tooltip>
        </Stack>

        {/* Form Animation */}
        <Box sx={{ mt: 6 }}>
          <AnimatePresence mode="wait">
            {tab === 0 && (
              <motion.div
                key="login"
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeVariant.transition}
                variants={fadeVariant}
              >
                <Login />
              </motion.div>
            )}
            {tab === 1 && (
              <motion.div
                key="register"
                initial="initial"
                animate="animate"
                exit="exit"
                transition={fadeVariant.transition}
                variants={fadeVariant}
              >
                <Register />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
