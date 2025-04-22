import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import Hero from '../components/HeroSection.jsx';
import Features from '../components/Features.jsx';

const About = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Features />
    </div>
  );
}

export default About;