import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import '../styles/About.css';
import HeaderFooter from './HeaderFooter';

const About = () => {
  return (
    <HeaderFooter>
      <Container maxWidth="md" className="about-container">
        <Typography variant="h3" gutterBottom className="about-title">
          SwapSkills: פלטפורמה להחלפת מיומנויות בין אנשים
        </Typography>
        <Typography variant="body1" paragraph className="about-description">
          ברוכים הבאים ל-SwapSkills! כאן תוכלו להציע את הכישורים שלכם בתמורה לכישורים של אחרים, ליצור קשרים חדשים וללמוד דברים חדשים בצורה מהנה ומעניינת.
        </Typography>

        <Paper elevation={3} className="about-section">
          <Typography variant="h4" gutterBottom className="section-title">
            מה זה SwapSkills?
          </Typography>
          <Typography variant="body1" paragraph>
            SwapSkills היא פלטפורמה שמאפשרת לכם להציע את הכישורים והידע שלכם בתמורה לכישורים של אחרים. לדוגמה, אם אתם מומחים בצילום, תוכלו להציע סדנת צילום בתמורה לשיעורי גיטרה, או אם אתם מבינים בבישול, תוכלו לקבל עזרה בעיצוב גרפי.
          </Typography>
        </Paper>

        <Paper elevation={3} className="about-section">
          <Typography variant="h4" gutterBottom className="section-title">
            פיצ'רים עיקריים
          </Typography>
          <Typography variant="body1" paragraph>
            <ul>
              <li>
                <strong>פרופיל משתמש עם כישורים:</strong> כל משתמש יכול להגדיר את הכישורים שהוא מציע ואת הכישורים שהוא מחפש. בנוסף, ניתן לראות מערכת דירוגים וחוות דעת על עסקאות שבוצעו.
              </li>
              <li>
                <strong>שוק החלפות:</strong> אפשרות לחפש משתמשים לפי כישורים, מיקום והעדפות, ולקבל הצעות מותאמות אישית המבוססות על אלגוריתם התאמה חכם.
              </li>
              <li>
                <strong>יצירת עסקאות:</strong> משתמשים יכולים להציע "עסקה" להחלפת כישורים, להשתמש בצ'אט מובנה לתיאום העסקה, ולנהל לוח זמנים מובנה לקביעת מועדים.
              </li>
              <li>
                <strong>נקודות Swap:</strong> למי שאין כישרון מתאים להחלפה, אפשר להרוויח ולשלם בנקודות. נקודות נצברות על ידי עזרה למשתמשים אחרים וניתנות למימוש בהחלפות עתידיות.
              </li>
              <li>
                <strong>אתגרים ופרסים:</strong> פיצ'ר שמציע אתגרים למשתמשים, כמו "תן שיעור ראשון חינם" או "סייע ב-5 כישורים שונים השבוע" בתמורה לנקודות בונוס.
              </li>
            </ul>
          </Typography>
        </Paper>

        <Paper elevation={3} className="about-section">
          <Typography variant="h4" gutterBottom className="section-title">
            פוטנציאל יצירתי
          </Typography>
          <Typography variant="body1" paragraph>
            <ul>
              <li>
                <strong>אלגוריתם חכם:</strong> יכולת להציע התאמות מתוחכמות בין משתמשים על בסיס תחומי עניין, מיקום ודירוגים.
              </li>
              <li>
                <strong>Gamification:</strong> משתמשים מקבלים "תגים" על פעילויות מיוחדות כמו "מורה מצטיין" או "מומחה רב תחומי".
              </li>
              <li>
                <strong>קהילה:</strong> יצירת קבוצה פעילה ומעורבת שמשתפת פעולה ומקדמת אחד את השני.
              </li>
            </ul>
          </Typography>
        </Paper>

        <Paper elevation={3} className="about-section">
          <Typography variant="h4" gutterBottom className="section-title">
            למה זה מגניב?
          </Typography>
          <Typography variant="body1" paragraph>
            SwapSkills היא פלטפורמה שמשלבת יצירתיות, עזרה הדדית וגישה כלכלית שיתופית. היא יוצרת ערך אישי עבור כל משתמש ומקדמת קהילה פעילה. פרויקט כזה יכול באמת לעניין אתכם בזכות החדשנות שבו.
          </Typography>
        </Paper>

        <Typography variant="h5" gutterBottom className="about-conclusion">
          בואו והצטרפו אלינו ל-SwapSkills, והתחילו להחליף מיומנויות וידע בצורה מהנה ומועילה!
        </Typography>
      </Container>
      </HeaderFooter>
  );
};

export default About;