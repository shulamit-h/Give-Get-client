import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Grid, TextField, Box } from '@mui/material';
import { fetchTalentsByParent, addTalentRequest } from '../api';

interface Talent {
  id: number;
  talentName: string;
  parentCategory: number;
  subTalents?: Talent[];
}

const Talents = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [newTalentName, setNewTalentName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetchTalentsByParent(0);
        const talentsWithSubTalents = await Promise.all(
          response.map(async (talent: Talent) => {
            const subTalents = await fetchTalentsByParent(talent.id);
            return { ...talent, subTalents };
          })
        );
        setTalents(talentsWithSubTalents);
      } catch (error) {
        console.error('Error fetching talents:', error);
      }
    };

    fetchTalents();
  }, []);

  const handleAddTalentRequest = async () => {
    if (!newTalentName.trim()) {
      setError('נא למלא שם כישרון.');
      return;
    }

    try {
      const userId = 1; // החלף את זה במזהה המשתמש האמיתי
      const parentCategory = 0; // החלף את זה בקטגוריית האב הנכונה אם יש
      const talentRequest = {
        UserId: userId,
        TalentName: newTalentName,
        ParentCategory: parentCategory,
        RequestDate: new Date()
      };

      await addTalentRequest(talentRequest);
      setNewTalentName('');
      setError(null);
      const response = await fetchTalentsByParent(0);
      const talentsWithSubTalents = await Promise.all(
        response.map(async (talent: Talent) => {
          const subTalents = await fetchTalentsByParent(talent.id);
          return { ...talent, subTalents };
        })
      );
      setTalents(talentsWithSubTalents);
    } catch (error) {
      console.error('Error adding talent request:', error);
      setError('הוספת הכשרון נכשלה.');
    }
  };

  return (
    <Container maxWidth="md" className="talents-container">
      <Typography variant="h4" gutterBottom>
        הכישרונות שלנו
      </Typography>
      <Grid container spacing={2}>
        {talents.map((talent) => (
          <Grid item xs={12} key={talent.id}>
            <Paper elevation={3} className="talent-card">
              <Typography variant="h6">{talent.talentName}</Typography>
              <Box ml={2}>
                {talent.subTalents?.map((subTalent) => (
                  <Typography key={subTalent.id} variant="body1">
                    - {subTalent.talentName}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper elevation={3} className="add-talent-card">
        <Typography variant="h6" gutterBottom>
          הוסף כישרון
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={newTalentName}
          onChange={(e) => setNewTalentName(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button variant="contained" color="primary" onClick={handleAddTalentRequest}>
          הוסף כישרון
        </Button>
      </Paper>
    </Container>
  );
};

export default Talents;