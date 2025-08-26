import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const fadeVariant = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3 },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'owner',
  });
const [demoLoading, setDemoLoading] = useState({
  owner: false,
  builder: false,
});
  const [showPassword, setShowPassword] = useState(false);
  const [btnState, setBtnState] = useState('default');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setBtnState('loading');
      const res = await axios.post(`${API}/auth/login`, {
        email: trimmedEmail,
        password: trimmedPassword,
        role: form.role,
      });

      const { token, username, role } = res.data.data;
      login(token, username, role);
      setBtnState('success');
      toast.success(`Welcome back, ${username}!`);

      setTimeout(() => {
        if (role === 'owner') navigate('/dashboard/owner', { replace: true });
        else if (role === 'builder') navigate('/dashboard/builder', { replace: true });
        else navigate('/', { replace: true });
      }, 500);
    } catch (error) {
      setBtnState('error');
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Invalid email or password.';
      toast.error(message);
      setTimeout(() => setBtnState('default'), 1500);
    }
  };

  const handleDemoLogin = async (role) => {
  try {
     setDemoLoading((prev) => ({ ...prev, [role]: true }));
    const res = await axios.post(`${API}/auth/demo-login`, { role }, {
      headers: { "Content-Type": "application/json" }
    });

    const { token, username, role: userRole } = res.data.data;

    login(token, username, userRole);

    toast.success(`Welcome, ${username}!`);

    setTimeout(() => {
      if (userRole === 'owner') navigate('/dashboard/owner', { replace: true });
      else if (userRole === 'builder') navigate('/dashboard/builder', { replace: true });
      else navigate('/', { replace: true });
    }, 500);

  } catch (error) {
    console.error("Demo login failed", error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Demo login failed.';
    toast.error(message);
  }
  finally {
    setDemoLoading((prev) => ({ ...prev, [role]: false }));
  }
};


  const renderBtnContent = () => {
    if (btnState === 'loading') return <CircularProgress size={26} sx={{ color: '#fefefeff' }} />;
    if (btnState === 'success') return '✔ Login Successful';
    if (btnState === 'error') return '⚠ Login Failed';
    return 'Login';
  };

  return (
    <motion.div {...fadeVariant}>
      <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(to right, #FF7A5A, #BF3F2C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel sx={{ color: '#d8c7b2', mb: 1, '&.Mui-focused': { color: '#d8c7b2' } }}>
                  Login as
                </FormLabel>
                <RadioGroup row name="role" value={form.role} onChange={handleChange}>
                  <FormControlLabel
                    value="owner"
                    control={<Radio sx={{ color: '#FF7A5A', '&.Mui-checked': { color: '#FF7A5A' } }} />}
                    label="Owner"
                  />
                  <FormControlLabel
                    value="builder"
                    control={<Radio sx={{ color: '#FF7A5A', '&.Mui-checked': { color: '#FF7A5A' } }} />}
                    label="Builder"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={handleChange}
                InputProps={{ sx: { color: '#f1e0d6' } }}
                InputLabelProps={{ sx: { color: '#d8c7b2' } }}
                sx={{
                  '& label.Mui-focused': { color: '#d8c7b2' },
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#FF7A5A' },
                    '&.Mui-focused fieldset': { borderColor: '#FF7A5A' },
                    '& input': {
                      color: 'white',
                      backgroundColor: '#2c2c2c',
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px #2c2c2c inset',
                      WebkitTextFillColor: 'white',
                      caretColor: 'white',
                    },
                  },
                }}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  sx: { color: '#f1e0d6' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#f1e0d6' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { color: '#d8c7b2' } }}
                sx={{
                  '& label.Mui-focused': { color: '#d8c7b2' },
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#FF7A5A' },
                    '&.Mui-focused fieldset': { borderColor: '#FF7A5A' },
                    '& input': {
                      color: 'white',
                      backgroundColor: '#2c2c2c',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={btnState === 'loading'}
                sx={{
                  py: 1.2,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  bgcolor: btnState === 'error' ? '#f87171' : btnState === 'success' ? '#34d399' : '#FF7A5A',
                  color: '#1c0f0f',
                  textTransform: 'none',
                  borderRadius: '1rem',
                  '&:hover': {
                    bgcolor: btnState === 'error' ? '#f87171' : btnState === 'success' ? '#34d399' : '#e7643f',
                    transform: 'scale(1.03)',
                  },
                }}
              >
                {renderBtnContent()}
              </Button>

<Button
  onClick={() => handleDemoLogin("owner")}
  fullWidth
  variant="outlined"
  disabled={demoLoading.owner}
    sx={{
    py: 0.7,
    fontSize: "0.85rem",
    fontWeight: 600,
    borderRadius: "0.8rem",
    textTransform: "none",
    backdropFilter: "blur(8px)",
    bgcolor: "rgba(58, 59, 59, 0.1)",  
    color: "#e0e0e0",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "all 0.25s ease-in-out",
    "&:hover": {
      bgcolor: "rgba(65, 65, 65, 0.2)",
    },
    "&.Mui-disabled": {
      bgcolor: "rgba(255,255,255,0.02)",
      color: "#777",
    },
  }}
>
  {demoLoading.owner ? (
    <CircularProgress size={18} sx={{ color: "#e0e0e0" }} />
  ) : (
    "Demo as Owner"
  )}
</Button>

<Button
  onClick={() => handleDemoLogin("builder")}
  fullWidth
  variant="outlined"
  disabled={demoLoading.builder}
  sx={{
    py: 0.7,
    fontSize: "0.85rem",
    fontWeight: 600,
    borderRadius: "0.8rem",
    textTransform: "none",
    backdropFilter: "blur(8px)",
    bgcolor: "rgba(58, 59, 59, 0.1)",  
    color: "#e0e0e0",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "all 0.25s ease-in-out",
    "&:hover": {
      bgcolor: "rgba(65, 65, 65, 0.2)",
    },
    "&.Mui-disabled": {
      bgcolor: "rgba(255,255,255,0.02)",
      color: "#777",
    },
  }}
>
  {demoLoading.builder ? (
    <CircularProgress size={18} sx={{ color: "#e0e0e0" }} />
  ) : (
    "Demo as Builder"
  )}
</Button>


            </Stack>
          </form>

      </Container>
    </motion.div>
  );
};

export default Login;
