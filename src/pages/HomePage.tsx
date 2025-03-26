import React from 'react';
import { Container, Grid, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchInspiration } from '../apis/InspirationApi';
import HeaderFooter from '../components/common/HeaderFooter';
import TopUsers from '../components/specific/TopUsers';
import { useState, useEffect } from 'react';
import '../styles/Home.css';





const Home = () => {
  const [inspiration, setInspiration] = useState('');

  useEffect(() => {
    const getInspiration = async () => {
      try {
        const quote = await fetchInspiration();
        setInspiration(quote);
      } catch (error) {
        console.error('Error fetching inspiration:', error);
      }
    };
    getInspiration();
  }, []);
  return (
    <HeaderFooter>
      <div className="home-container">
        <section className="hero-section">
          <Container maxWidth="xl" className="hero-container">
            <Typography variant="h2" className="hero-title">
              גלו את הכישרונות שלכם
            </Typography>
            <Typography variant="h5" className="hero-subtitle">
              הציגו, גלו והתחברו למספר כישרונות במגוון תחומים – המעבר שלכם להצלחה מתחיל כאן.
            </Typography>
            {inspiration && (
              <Typography variant="h6" className="inspiration-quote">
                "{inspiration}"
              </Typography>
            )}

            <div className="hero-buttons">
              <Button variant="contained" className="hero-button" component={RouterLink} to="/register">
                הרשמה
              </Button>
              <Button variant="outlined" className="hero-button" component={RouterLink} to="/login">
                התחברות
              </Button>
            </div>
          </Container>
        </section>

        <section className="features-section">
          <Container maxWidth="xl" className="features-container">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={4} className="feature-card">
                  <Typography variant="h5" gutterBottom>
                    גלו כישרונות
                  </Typography>
                  <Typography variant="body1">
                    מצאו כישרונות חדשים ומרתקים, וגלו עולמות חדשים של יצירתיות.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={4} className="feature-card">
                  <Typography variant="h5" gutterBottom>
                    הציגו את הכשרון שלכם
                  </Typography>
                  <Typography variant="body1">
                    הציגו את היכולות שלכם בצורה מרהיבה וקבלו הכרה והערכה מהקהילה.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={4} className="feature-card">
                  <Typography variant="h5" gutterBottom>
                    התחברו עם אנשים
                  </Typography>
                  <Typography variant="body1">
                    חוו אינטראקציות משמעותיות ושיתופי פעולה שיעניקו לכם השראה והצלחה.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </section>

        <section className="top-users-section">
          <Container maxWidth="xl">
            <TopUsers />
          </Container>
        </section>
      </div>
    </HeaderFooter>
  );
};

export default Home;
