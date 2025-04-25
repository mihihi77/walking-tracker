import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// CardWidget Component
const CardWidget = ({ title, value, icon, color = "green" }) => {
  const backgroundColor = color === "green" ? 'rgba(29, 185, 84, 0.8)'  : '#333'; // Change color based on prop
  return (
    <Card sx={{
      minWidth: 200,
      maxWidth: 400,
      marginLeft: '12px',
      backgroundColor: '#121212',
      padding: '15px',
      borderRadius: '7px',
      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
    }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: '#12a245', fontSize: 18, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: '#ffffff' }}>
          {value}
        </Typography>
        <Typography sx={{ color: '#12a245', mb: 1.5 }}>
          {icon}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

export default CardWidget;
