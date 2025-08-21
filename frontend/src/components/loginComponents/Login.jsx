// Only small changes around the submit button and state
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
import { motion, AnimatePresence, motionValue, useMotionValue } from 'framer-motion';
import { toast } from 'react-toastify';
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

  const renderBtnContent = () => {
    if (btnState === 'loading') return <CircularProgress size={26} sx={{ color: '#fefefeff' }} />;
    if (btnState === 'success') return '✔ Login Successful';
    if (btnState === 'error') return '⚠ Login Failed';
    return 'Login';
  };

  return (
    <motion.div {...fadeVariant}>
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#1b1b1bff',
            color: '#f1e0d6',
            boxShadow: 5,
          }}
        >
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
                <FormLabel sx={{ color: '#d8c7b2', mb: 1 , '&.Mui-focused': { color: '#d8c7b2' },}}>Login as</FormLabel>
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
                    // '& fieldset': { borderColor: '#a47155' },
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
                    // '& fieldset': { borderColor: '#a47155' },
                    '&:hover fieldset': { borderColor: '#FF7A5A' },
                    '&.Mui-focused fieldset': { borderColor: '#FF7A5A' },
                    
                  },
                }}
              />

              {/* ✅ Very small change here: animated button */}
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
                  '&:hover': { bgcolor: btnState === 'error' ? '#f87171' : btnState === 'success' ? '#34d399' : '#e7643f', transform: 'scale(1.03)' },
                }}
              >
                {renderBtnContent()}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#c0b3a0' }}>
            Forgot your password?{' '}
            <span
              onClick={() => navigate('/forgot-password')}
              style={{ color: '#FF7A5A', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              Reset here
            </span>
          </Typography>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Login;
