import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-wrapper">
      {/* רקע מונפש */}
      <div className="background-animation"></div>

      <Container maxWidth="lg" className="about-container">
        {/* כותרת עם טקסט דינמי */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="title-wrapper"
        >
          <Typography variant="h3" className="about-title">
            SwapSkills: <span className="magic-text">לומדים. מחליפים. מתקדמים.</span>
          </Typography>
          <Typography variant="h6" className="about-subtitle">
            הגיע הזמן לנצל את הכישרונות שלך בצורה הטובה ביותר!  
          </Typography>
        </motion.div>

        {/* כרטיסיות עם אנימציות */}
        <Grid container spacing={4} className="about-sections">
          {[
            { icon: "⚡", title: "מה זה SwapSkills?", text: "פלטפורמה להחלפת כישורים – את לומדת, את מלמדת, את מרוויחה!" },
            { icon: "🔄", title: "איך זה עובד?", text: "מציינת כישורים, בוחרת מה ללמוד, ומוצאת התאמות מדויקות – הכל בלחיצת כפתור!" },
            { icon: "🔥", title: "למה זה מגניב?", text: "כי לומדים, מרוויחים נקודות, ומתחברים לקהילה חכמה." },
            { icon: "🚀", title: "הצטרפי עכשיו!", text: "אל תפספסי את ההזדמנות להתחיל להחליף ידע עם אחרים!" }
          ].map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="about-card">
                  <CardContent>
                    <Typography variant="h5" className="card-title">
                      {item.icon} {item.title}
                    </Typography>
                    <Typography variant="body1">{item.text}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* כפתור קריאה לפעולה */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="cta-wrapper"
        >
          <Button variant="contained" className="join-button">
            ✨ הצטרפי עכשיו בחינם!
          </Button>
        </motion.div>
      </Container>
    </div>
  );
};

export default About;
