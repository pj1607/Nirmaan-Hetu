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
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'owner',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering:', form);
    // Call register API here
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
            mb: 1,
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
                {['owner', 'builder'].map((value) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={
                      <Radio
                        sx={{
                          color: '#FF7A5A',
                          '&.Mui-checked': { color: '#FF7A5A' },
                        }}
                      />
                    }
                    label={value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {['name', 'email', 'password'].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                fullWidth
                required
                value={form[field]}
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
            ))}

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
              Register
            </Button>
          </Stack>
        </form>

      </Box>
    </Container>
  );
};

export default Register;
