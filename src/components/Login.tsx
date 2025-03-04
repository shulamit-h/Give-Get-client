import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../api';
import '../styles/AuthForm.css';

function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    pwd: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    userName: false,
    pwd: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFieldErrors = {
      userName: !formData.userName,
      pwd: !formData.pwd,
    };

    if (Object.values(newFieldErrors).some(error => error)) {
      setFieldErrors(newFieldErrors);
      setError('נא למלא את כל השדות החובה המסומנים באדום.');
      return;
    }

    setError(null);
    try {
      const response = await loginUser(formData.userName, formData.pwd);
      console.log('Login successful:', response);
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'ההתחברות נכשלה');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
      <Typography variant="h6" className="form-title">התחברות</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="userName"
        label="שם משתמש"
        name="userName"
        autoComplete="username"
        autoFocus
        value={formData.userName}
        onChange={handleChange}
        error={fieldErrors.userName}
        helperText={fieldErrors.userName && "נא למלא שם משתמש"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="pwd"
        label="סיסמא"
        type={showPassword ? 'text' : 'password'}
        id="pwd"
        autoComplete="current-password"
        value={formData.pwd}
        onChange={handleChange}
        error={fieldErrors.pwd}
        helperText={fieldErrors.pwd && "נא למלא סיסמא"}
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
        התחברות
      </Button>
    </Box>
  );
}

export default Login;