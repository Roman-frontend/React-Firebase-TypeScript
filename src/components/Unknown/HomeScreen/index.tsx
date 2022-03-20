import { Box, Typography } from '@mui/material';
import React from 'react';

const HomeScreen: React.FC = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h1">Home page</Typography>
    </Box>
  );
};

export default HomeScreen;
