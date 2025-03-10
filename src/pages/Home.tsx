import React from 'react';
import { Container, Grid, Typography, Button, Paper, AppBar, Toolbar, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <AppBar position="sticky" className="app-bar">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="app-title">
            אתר הכישרונות
          </Typography>
          <Button color="inherit" component={RouterLink} to="/home">דף הבית</Button>
          <Button color="inherit" component={RouterLink} to="/about">אודות</Button>
          <Button color="inherit" component={RouterLink} to="/comments">תגובות</Button>
          <Button color="inherit" component={RouterLink} to="/login">התחברות</Button>
          <Button color="inherit" component={RouterLink} to="/talents">הכישרונות שלנו</Button>
        </Toolbar>
      </AppBar>

      <section className="hero-section">
        <Container maxWidth="xl" className="hero-container">
          <Typography variant="h2" className="hero-title">
            גלו את הכישרונות שלכם
          </Typography>
          <Typography variant="h5" className="hero-subtitle">
            הציגו, גלו והתחברו למספר כישרונות במגוון תחומים – המעבר שלכם להצלחה מתחיל כאן.
          </Typography>
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
      
      <footer className="footer">
        <Container maxWidth="xl">
          <Typography variant="body2" align="center">
            © 2023 אתר הכישרונות. כל הזכויות שמורות.
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default Home;