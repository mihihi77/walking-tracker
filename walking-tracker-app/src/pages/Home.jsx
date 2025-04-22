import '../styles/CardWidget.css';  // Import CSS nếu cần thiết
import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material'; // Import Typography, Grid và Container từ MUI
import CardWidget from '../components/CardWidget';  // Đảm bảo đường dẫn đúng với CardWidget
import Activities from '../components/ActivitiesWidget'; // Đảm bảo đường dẫn đúng

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '0px' }}>
      {/* Tiêu đề "Main Dashboard" */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2C3E50', marginBottom: '20px' }}>
        Main Dashboard
      </Typography>

      {/* Target Section */}
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Target</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}> {/* Điều chỉnh để thích ứng với các màn hình lớn */}
            <CardWidget title="Calories Burned" value="3,000" icon="🔥" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Steps Walked" value="12,345" icon="👟" />
          </Grid>
        </Grid>
      </Box>

      {/* Yesterday Section */}
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Yesterday</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Calories Burned" value="2,800" icon="🔥" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardWidget title="Steps Walked" value="11,234" icon="👟" />
          </Grid>
        </Grid>
      </Box>

      {/* Last Week Section */}
<Box>
  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Last Week</Typography>

  {/* Biểu đồ đặt phía trên */}
  <Box sx={{ marginBottom: '30px' }}>
    <Activities />
  </Box>

  <Grid container spacing={3}>
    <Grid item xs={12} sm={6} md={4}>
      <CardWidget title="Calories Burned" value="20,000" icon="🔥" />
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <CardWidget title="Steps Walked" value="75,000" icon="👟" />
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <CardWidget title="Active Days" value="30" icon="📅" />
    </Grid>
  </Grid>
</Box>

    </Container>
  );
};

export default Home;
