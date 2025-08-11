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
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';
import RoleSelectModal from "../../modal/RoleSelectModal";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/auth/login`, {
        email: trimmedEmail,
        password: trimmedPassword,
        role: form.role,
      });

      const { token, username,role } = res.data.data;
      login(token, username,role);
      toast.success(`Welcome back, ${username}!`);
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
        'Invalid email or password.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
              {/* Role selection */}
              <FormControl component="fieldset">
                <FormLabel sx={{ color: '#d8c7b2', mb: 1 }}>Login as</FormLabel>
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

              {/* Email */}
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

              {/* Password with visibility toggle */}
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

              {/* Submit */}
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
                  'Login'
                )}
              </Button>
            </Stack>
          </form>
          {/* Forgot password */}
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              textAlign: 'center',
              color: '#c0b3a0',
            }}
          >
            Forgot your password?{' '}
            <span
              onClick={() => navigate('/forgot-password')}
              style={{
                color: '#FF7A5A',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
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
