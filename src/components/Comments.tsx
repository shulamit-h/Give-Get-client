import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Avatar, Grid } from '@mui/material';
import { fetchComments, addComment } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Comments.css';
import { Comment } from '../Types/Types';


const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const response = await fetchComments();
        setComments(response);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchAllComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError('נא למלא תוכן תגובה.');
      return;
    }

    try {
      await addComment(newComment);
      setNewComment('');
      setError(null);
      const response = await fetchComments();
      setComments(response);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('הוספת התגובה נכשלה.');
    }
  };

  return (
    <Container maxWidth="md" className="comments-container">
      <Typography variant="h4" gutterBottom>
        תגובות
      </Typography>
      <div className="comments-grid">
        {comments.map((comment) => (
          <Paper key={comment.id} elevation={3} className="comment-card">
            <Grid container spacing={2}>
              <Grid item>
                <Avatar src={comment.profileImage} alt={comment.userName} />
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{comment.userName}</Typography>
                <Typography variant="body1">{comment.content}</Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </div>
      <Paper elevation={3} className="add-comment-card">
        <Typography variant="h6" gutterBottom>
          הוסף תגובה
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button variant="contained" color="primary" onClick={handleAddComment}>
          הוסף תגובה
        </Button>
      </Paper>
    </Container>
  );
};

export default Comments;