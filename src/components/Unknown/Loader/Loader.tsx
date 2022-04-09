import React, { ReactElement } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader(): ReactElement {
  return (
    <Box
      sx={{ display: 'flex', height: '100vh', width: '100vw' }}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
}
