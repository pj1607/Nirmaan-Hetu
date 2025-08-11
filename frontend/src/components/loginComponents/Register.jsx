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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedUserName = form.username.trim();
  const trimmedEmail = form.email.trim();
  const trimmedPassword = form.password.trim();
  const trimmedConfirmPassword = form.confirmPassword.trim();

  if (trimmedPassword !== trimmedConfirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(`${API}/auth/register`, {
      username: trimmedUserName,
      email: trimmedEmail,
      password: trimmedPassword,
      confirmPassword: trimmedConfirmPassword,
      role: form.role,
    });
  const { token, username, role } = res.data.data;
login(token, username, role);


    toast.success(`Welcome, ${username}!`);
    if (role === 'owner') {
      navigate('/dashboard/owner', { replace: true });
    } else if (role === 'builder') {
      navigate('/dashboard/builder', { replace: true });
    } else {
      navigate('/', { replace: true });
    }

  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong';
    toast.error(message);
  } finally {
    setLoading(false);
  }
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
              <RadioGroup
                row
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="owner"
                  control={
                    <Radio
                      sx={{
                        color: '#FF7A5A',
                        '&.Mui-checked': { color: '#FF7A5A' },
                      }}
                    />
                  }
                  label="Owner"
                />
                <FormControlLabel
                  value="builder"
                  control={
                    <Radio
                      sx={{
                        color: '#FF7A5A',
                        '&.Mui-checked': { color: '#FF7A5A' },
                      }}
                    />
                  }
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#f1e0d6' }}
                    >
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
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#f1e0d6' }}
                    >
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
              disabled={loading}
              sx={{
                py: 1.2,
                fontWeight: 'bold',
                fontSize: '1rem',
                bgcolor: '#FF7A5A',
                color: '#1c0f0f',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#e7643f',
                  transform: 'scale(1.03)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={26} sx={{ color: '#1c0f0f' }} />
              ) : (
                'Register'
              )}
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
