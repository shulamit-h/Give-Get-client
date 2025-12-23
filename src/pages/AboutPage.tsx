import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/About.css";
import "../styles/colors.css"; // Import colors stylesheet

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="background-animation"></div>

      <Container maxWidth="lg" className="about-container">
        {/* Main title animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="title-wrapper"
        >
          <Typography variant="h3" className="about-title">
            <span className="magic-text"> Give & Get: תנו, קבלו, התקדמו.</span>
          </Typography>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="subtitle-wrapper"
        >
          <Typography variant="h5" className="about-subtitle">
            <span className="magic-text">הגיע הזמן לנצל את הכישרונות שלכם בצורה הטובה ביותר!</span>
            
          </Typography>
          
        </motion.div>

        

        {/* The cards */}
        <Grid container spacing={2} className="about-sections">
          {[ 
            { icon: "⚡", title: "מה זה Give & Get?", text: "פלטפורמה להחלפת כישורים – אתם נותנים, לומדים, ומרוויחים!" },
            { icon: "🔄", title: "איך זה עובד?", text: "מציינים כישורים, בוחרים מה ללמוד, ומוצאים התאמות מדויקות – הכל בלחיצת כפתור!" },
            { icon: "🔥", title: "למה זה מגניב?", text: "כי לומדים, מרוויחים נקודות, ומתחברים לקהילה חכמה." },
            { icon: "🚀", title: "הצטרפו עכשיו!", text: "אל תפספסו את ההזדמנות להתחיל להחליף ידע עם אחרים!" }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`card-wrapper color-${index}`}
              >
                <Card className="about-card">
                  <CardContent>
                    <Typography variant="h6" className="card-title">
                      {item.icon} {item.title}
                    </Typography>
                    <Typography variant="body2">{item.text}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Call-to-action button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="cta-wrapper"
        >
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button variant="contained" className="join-button">
              ✨ הצטרפו עכשיו בחינם!
            </Button>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
};

export default About;
