import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Profile from './components/Profile'; // הנתיב שלך לדף פרופיל
import UpdateProfile from './components/UpdateProfile';
import Comments from './components/Comments';
import Talents from './components/Talents';
import About from './components/About';
import TalentRequests from './components/TalentRequests';
import Exchange from './components/Exchange';
import ChatPage from './pages/ChatPage';
import ExchangePage from './pages/ExchangePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d6878b',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/talents" element={<Talents />} />
          <Route path="/about" element={<About />} />
          <Route path="/talent-requests" element={<TalentRequests />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/chat/:exchangeId" element={<ChatPage />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;