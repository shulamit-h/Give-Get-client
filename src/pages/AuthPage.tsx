import React, { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import Login from '../components/Login';
import Register from '../components/Register';
import '../styles/AuthPage.css';

function AuthPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="sm" className="auth-container">
      <Box className="auth-box">
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {value === 0 && <Login />}
        {value === 1 && <Register />}
      </Box>
    </Container>
  );
}

export default AuthPage;