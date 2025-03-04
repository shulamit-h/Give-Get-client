import React from 'react';
import { Container, Typography, AppBar, Toolbar, Button, Grid, Paper, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';

const HeroContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
}));

const HeroButtons = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
}));

const HomePage = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            אתר כשרונות
          </Typography>
          <Button color="inherit" component={RouterLink} to="/register">
            הרשמה
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            התחברות
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <HeroContent>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              ברוכים הבאים לאתר כשרונות
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              המקום למצוא ולהציג את הכשרונות שלך
            </Typography>
            <HeroButtons>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" component={RouterLink} to="/register">
                    הרשמה
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" component={RouterLink} to="/login">
                    התחברות
                  </Button>
                </Grid>
              </Grid>
            </HeroButtons>
          </Container>
        </HeroContent>
        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  גלה כשרונות
                </Typography>
                <Typography variant="body1">
                  חפש וגלה כשרונות חדשים בתחומים שונים.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  הצג את הכשרון שלך
                </Typography>
                <Typography variant="body1">
                  הצג את הכשרון שלך וקבל הכרה מאחרים.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  התחבר עם אחרים
                </Typography>
                <Typography variant="body1">
                  התחבר עם אנשים בעלי עניין דומה ושתף פעולה.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
      <Footer>
        <Container maxWidth="lg">
          <Typography variant="body1">אתר כשרונות © 2025</Typography>
        </Container>
      </Footer>
    </>
  );
};

export default HomePage;