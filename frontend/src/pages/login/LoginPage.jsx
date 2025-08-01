import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Tooltip,
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
  transition: { duration: 0.1},
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
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
         background: 'linear-gradient(145deg, #202020ff 30%, #1f1f1f 70%)',
       
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          minHeight: isMobile ? '85vh' : 500,
          px: isMobile ? 0 : 6,
          py: isMobile ? 0 : 5,
         
        }}
      >
        {/* Icon Switcher */}
        <Stack
          spacing={1}
          sx={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 10,
            alignItems: 'center',
          }}
        >
          <Tooltip title="Login" placement="left">
            <IconButton
              onClick={() => setTab(0)}
              sx={{
                color: tab === 0 ? '#E89B4A' : '#fff',
                bgcolor: tab === 0 ? '#3a1c1c' : 'transparent',
                '&:hover': {
                  bgcolor: '#3a1c1c',
                },
              }}
            >
              <LoginIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Register" placement="left">
            <IconButton
              onClick={() => setTab(1)}
              sx={{
                color: tab === 1 ? '#E89B4A' : '#fff',
                bgcolor: tab === 1 ? '#3a1c1c' : 'transparent',
                '&:hover': {
                  bgcolor: '#3a1c1c',
                },
              }}
            >
              <AppRegistrationIcon />
            </IconButton>
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
