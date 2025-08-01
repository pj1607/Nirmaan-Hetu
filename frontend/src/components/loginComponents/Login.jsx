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
} from '@mui/material';
import { motion } from 'framer-motion';

const fadeVariant = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3 },
};

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'owner',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', form);
    // Call login API here
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
                type="password"
                fullWidth
                required
                value={form.password}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
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
                Login
              </Button>
            </Stack>
          </form>

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
              onClick={() => alert('Password reset flow here')}
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
