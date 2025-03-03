import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../api';
import '../styles/AuthForm.css';

function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = await loginUser(formData.userName, formData.password);
      console.log('Login successful, token:', token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
      <Typography variant="h6" className="form-title">Login</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="userName"
        label="Username"
        name="userName"
        autoComplete="username"
        autoFocus
        value={formData.userName}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" fullWidth variant="contained" className="submit-btn">
        Sign In
      </Button>
    </Box>
  );
}

export default Login;