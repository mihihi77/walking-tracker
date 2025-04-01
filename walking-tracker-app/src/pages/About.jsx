import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2C3E50', marginBottom: '20px' }}>
        Welcome to WalkMate
      </Typography>
      
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          About WalkMate
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', fontSize: '1rem' }}>
          WalkMate is an application designed to help you track your walking progress. 
          With features such as monitoring calories burned, steps walked, and active days, 
          WalkMate helps you stay on top of your fitness journey.
        </Typography>
      </Box>
      
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Features
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', fontSize: '1rem' }}>
          - Track Calories Burned
          <br />
          - Monitor Steps Walked
          <br />
          - See your Progress over time
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
