import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import CardWidget from '../components/CardWidget';
import Activities from '../components/ActivitiesWidget';
import useUserStats from '../hooks/useUserStats';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    // Cleanup để tránh memory leak
    return () => unsubscribe();
  }, [auth]);

  const { calories, steps, activeDays, weeklyCalories, weeklySteps } = useUserStats(userId);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!userId) {
    return <Typography variant="h6">Please log in to view your dashboard.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: '0px' }}>
      {/* Target Section */}
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Target</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Calories Burned" value={calories.toLocaleString()} icon="🔥" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Steps Walked" value={steps.toLocaleString()} icon="👟" />
          </Grid>
        </Grid>
      </Box>

      {/* Last Week Section */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Last Week</Typography>

        <Box sx={{ marginBottom: '30px' }}>
          <Activities userId={userId} />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget 
            title="Calories Burned" 
            value={(calories ?? 0).toLocaleString()} 
            icon="🔥" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Steps Walked" value={(steps ?? 0).toLocaleString()} icon="👟" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Active Days" value={(activeDays ?? 0)} icon="📅" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
