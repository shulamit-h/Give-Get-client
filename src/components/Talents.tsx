import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Grid, TextField, Box, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { fetchTalentsByParent, addTalentRequest } from '../api';
import axios from 'axios';

interface Talent {
  id: number;
  talentName: string;
  parentCategory: number;
  subTalents?: Talent[];
}

const Talents = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [newTalentName, setNewTalentName] = useState('');
  const [parentTalentId, setParentTalentId] = useState<number | string>('');
  const [error, setError] = useState<string | null>(null);
  const [parentTalents, setParentTalents] = useState<Talent[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

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
        setParentTalents(response);
      } catch (error) {
        console.error('Error fetching talents:', error);
      }
    };

    fetchTalents();
  }, []);

  const handleAddTalentRequest = async () => {
    if (!newTalentName.trim() || !parentTalentId) {
      setError('נא למלא את כל השדות.');
      return;
    }

    try {
      const userId = token ? 1 : 0; // החלף את זה במזהה המשתמש האמיתי אם יש טוקן
      const talentRequest = {
        UserId: userId,
        TalentName: newTalentName,
        ParentCategory: parentTalentId === 'other' ? 0 : Number(parentTalentId),
        RequestDate: new Date()
      };

      await addTalentRequest(talentRequest);
      setNewTalentName('');
      setParentTalentId('');
      setError(null);
      setSnackbarMessage('בקשת הוספת הכשרון התבצע בהצלחה.');
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
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            value={parentTalentId}
            onChange={(e) => setParentTalentId(e.target.value)}
            label="בחר כישרון אב"
          >
            {parentTalents.map((talent) => (
              <MenuItem key={talent.id} value={talent.id}>
                {talent.talentName}
              </MenuItem>
            ))}
            <MenuItem value="other">אחר</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="outlined"
          value={newTalentName}
          onChange={(e) => setNewTalentName(e.target.value)}
          error={!!error}
          helperText={error}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddTalentRequest}>
          הוסף כישרון
        </Button>
      </Paper>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Talents;

