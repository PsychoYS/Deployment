import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Paper,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    rating: 5
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/api/feedback', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      
      if (response.data.success) {
        setOpen(true);
        setFormData({
          subject: '',
          message: '',
          rating: 5
        });
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError(err.response?.data?.message || 'Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: '#1e1e1e', color: '#fff' }}>
        <Typography variant="h4" gutterBottom>
          Provide Feedback
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Your feedback helps us improve our services. Please share your thoughts with us.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            rows={4}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          
          <Box sx={{ mb: 2 }}>
            <Typography component="legend" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Rate our service
            </Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#d4af37',
                },
                '& .MuiRating-iconEmpty': {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{
              bgcolor: '#d4af37',
              color: '#000',
              '&:hover': {
                bgcolor: '#c4a030',
              },
              '&:disabled': {
                bgcolor: 'rgba(212, 175, 55, 0.5)',
              },
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Box>
        
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Thank you for your feedback!
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Feedback; 