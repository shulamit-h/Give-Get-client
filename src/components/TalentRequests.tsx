import React, { useEffect, useState } from 'react';
import { fetchTalentRequests, deleteTalentRequest, updateTalentRequest } from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, TextField, Grid, Box } from '@mui/material';

const TalentRequests = () => {
  const [talentRequests, setTalentRequests] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedTalent, setEditedTalent] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await fetchTalentRequests();
        setTalentRequests(data);
      } catch (error) {
        console.error('Error fetching talent requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTalentRequest(id);
      setTalentRequests(talentRequests.filter(req => req.id !== id));
    } catch (error) {
      console.error('Error deleting talent request:', error);
    }
  };

  const handleEdit = (id: number) => {
    setEditMode({ ...editMode, [id]: true });
    const talentToEdit = talentRequests.find(req => req.id === id);
    setEditedTalent(talentToEdit);
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateTalentRequest(id, editedTalent);
      setEditMode({ ...editMode, [id]: false });
      const updatedRequests = talentRequests.map(req => req.id === id ? editedTalent : req);
      setTalentRequests(updatedRequests);
    } catch (error) {
      console.error('Error updating talent request:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    const { name, value } = e.target;
    setEditedTalent({ ...editedTalent, [name]: value });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        בקשות להוספת כשרונות
      </Typography>
      {talentRequests.map((request) => (
        <Paper key={request.id} elevation={3} className="talent-request-card">
          {editMode[request.id] ? (
            <Box>
              <TextField
                fullWidth
                margin="normal"
                label="שם כשרון"
                name="TalentName"
                value={editedTalent.TalentName}
                onChange={(e) => handleChange(e, request.id)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="קטגוריית אב"
                name="ParentCategory"
                value={editedTalent.ParentCategory}
                onChange={(e) => handleChange(e, request.id)}
              />
              <Button onClick={() => handleUpdate(request.id)} variant="contained" color="primary">
                עדכן
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">{request.TalentName}</Typography>
              <Typography variant="body1">קטגוריית אב: {request.ParentCategory}</Typography>
              <Typography variant="body1">מאת: {request.UserId}</Typography>
              <Button onClick={() => handleEdit(request.id)} variant="contained" color="primary">
                ערוך
              </Button>
              <Button onClick={() => handleDelete(request.id)} variant="contained" color="secondary">
                מחק
              </Button>
            </Box>
          )}
        </Paper>
      ))}
    </Container>
  );
};

export default TalentRequests;