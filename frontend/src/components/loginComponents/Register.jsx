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
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [btnState, setBtnState] = useState('default'); // ✅ small change

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUserName = form.username.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();
    const trimmedConfirmPassword = form.confirmPassword.trim();

    if (!trimmedUserName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setBtnState('loading'); // ✅ small change
      const res = await axios.post(`${API}/auth/register`, {
        username: trimmedUserName,
        email: trimmedEmail,
        password: trimmedPassword,
        confirmPassword: trimmedConfirmPassword,
        role: form.role,
      });

      const { token, username, role } = res.data.data;
      login(token, username, role);
      setBtnState('success'); // ✅ small change
      toast.success(`Welcome, ${username}!`);

      setTimeout(() => {
        if (role === 'owner') navigate('/dashboard/owner', { replace: true });
        else if (role === 'builder') navigate('/dashboard/builder', { replace: true });
        else navigate('/', { replace: true });
      }, 500);

    } catch (error) {
      setBtnState('error'); // ✅ small change
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Something went wrong';
      toast.error(message);
      setTimeout(() => setBtnState('default'), 1500);
    }
  };

  const renderBtnContent = () => {
    if (btnState === 'loading') return <CircularProgress size={26} sx={{ color: '#fefefeff' }} />;
    if (btnState === 'success') return '✔ Registration Successful';
    if (btnState === 'error') return '⚠ Registration Failed';
    return 'Register';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: '#1b1b1bff',
          color: '#f1e0d6',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'linear-gradient(to right, #FF7A5A, #BF3F2C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl component="fieldset">
              <FormLabel sx={{ color: '#d8c7b2', mb: 1 }}>Register as</FormLabel>
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
              label="Name"
              name="username"
              type="text"
              fullWidth
              required
              value={form.username}
              onChange={handleChange}
              InputProps={{ sx: { color: '#f1e0d6' } }}
              InputLabelProps={{ sx: { color: '#d8c7b2' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#a47155' },
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
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#a47155' },
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
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#a47155' },
                  '&:hover fieldset': { borderColor: '#FF7A5A' },
                  '&.Mui-focused fieldset': { borderColor: '#FF7A5A' },
                },
              }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              required
              value={form.confirmPassword}
              onChange={handleChange}
              InputProps={{
                sx: { color: '#f1e0d6' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: '#f1e0d6' }}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#d8c7b2' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#a47155' },
                  '&:hover fieldset': { borderColor: '#FF7A5A' },
                  '&.Mui-focused fieldset': { borderColor: '#FF7A5A' },
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
                '&:hover': { bgcolor: btnState === 'error' ? '#f87171' : btnState === 'success' ? '#34d399' : '#e7643f', transform: 'scale(1.03)' },
              }}
            >
              {btnState === 'loading' ? <CircularProgress size={26} sx={{ color: '#fefefeff' }} /> :
               btnState === 'success' ? '✔ Registration Successful' :
               btnState === 'error' ? '⚠ Registration Failed' : 'Register'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
