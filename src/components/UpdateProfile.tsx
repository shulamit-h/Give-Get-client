import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, IconButton, InputAdornment, Alert, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, updateUserData } from '../api';
import '../styles/AuthForm.css';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'Female',
    desc: '',
    profileImage: null as File | null,
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    email: false,
    password: false,
    age: false,
    gender: false,
    phoneNumber: false,
    desc: false,
  });
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUserId(userData.id);
        setFormData({
          username: userData.userName,
          email: userData.email,
          password: '',
          age: userData.age.toString(),
          gender: userData.gender === 0 ? 'Male' : 'Female',
          desc: userData.desc,
          profileImage: null,
          phoneNumber: userData.phoneNumber,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    getUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFieldErrors = {
      username: !formData.username,
      email: !formData.email,
      password: false,
      age: !formData.age,
      gender: !formData.gender,
      phoneNumber: !formData.phoneNumber,
      desc: !formData.desc,
    };

    if (Object.values(newFieldErrors).some(error => error)) {
      setFieldErrors(newFieldErrors);
      setError('נא למלא את כל השדות החובה המסומנים באדום.');
      return;
    }

    setError(null);
    try {
      if (userId !== null) {
        const response = await updateUserData(userId, formData);
        console.log('Update successful:', response);
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      setError(error.message || 'העדכון נכשל');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form">
      <Typography variant="h6" className="form-title">עדכון פרופיל</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success">
          הפרופיל התעדכן בהצלחה
        </Alert>
      </Snackbar>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="שם משתמש"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        error={fieldErrors.username}
        helperText={fieldErrors.username && "נא למלא שם משתמש"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="כתובת אימייל"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        helperText={fieldErrors.email && "נא למלא כתובת אימייל"}
      />
      <TextField
        margin="normal"
        fullWidth
        name="password"
        label="סיסמא"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        helperText={fieldErrors.password && "נא למלא סיסמא"}
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
      <TextField
        margin="normal"
        required
        fullWidth
        name="age"
        label="גיל"
        type="number"
        id="age"
        value={formData.age}
        onChange={handleChange}
        error={fieldErrors.age}
        helperText={fieldErrors.age && "נא למלא גיל"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="gender"
        label="מין"
        select
        value={formData.gender}
        onChange={handleChange}
        error={fieldErrors.gender}
        helperText={fieldErrors.gender && "נא לבחור מין"}
      >
        <MenuItem value="Male">זכר</MenuItem>
        <MenuItem value="Female">נקבה</MenuItem>
      </TextField>
      <TextField
        margin="normal"
        required
        fullWidth
        name="phoneNumber"
        label="מספר טלפון"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={fieldErrors.phoneNumber}
        helperText={fieldErrors.phoneNumber && "נא למלא מספר טלפון"}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="desc"
        label="תיאור"
        multiline
        rows={4}
        value={formData.desc}
        onChange={handleChange}
        error={fieldErrors.desc}
        helperText={fieldErrors.desc && "נא למלא תיאור"}
      />
      <Button variant="contained" component="label" fullWidth className="upload-btn">
        העלאת תמונת פרופיל
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {fileName && (
        <Box sx={{ mt: 1, p: 1, border: '1px dashed grey', borderRadius: '4px' }}>
          <Typography variant="body2" color="textSecondary">
            {fileName}
          </Typography>
        </Box>
      )}
      <Button type="submit" fullWidth variant="contained" className="submit-btn">
        עדכון פרופיל
      </Button>
    </Box>
  );
};

export default UpdateProfile;