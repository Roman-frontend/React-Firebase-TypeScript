import React, { FC } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import mainImage from '../../auth-image.png';
import voypostIcon from '../../voypost.png';

interface IProps {
  component: FC;
}

export default function StaticAuth({ component: Component }: IProps) {
  return (
    <>
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        style={{ background: 'lightgray' }}
      >
        <Container fixed maxWidth="lg">
          <Grid container>
            <Grid item xs={6}>
              <Box sx={{ textAlign: '-webkit-right' }}>
                <img src={mainImage} alt="home" style={{ height: '100vh' }} />
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              style={{ background: 'white', textAlign: 'center' }}
            >
              <Paper
                sx={{
                  position: 'relative',
                  top: '25vh',
                  height: '85vh',
                }}
              >
                <Box>
                  <img
                    id="voypost-icon"
                    src={voypostIcon}
                    alt="voypost-icon"
                    style={{ width: 100 }}
                  />
                </Box>
                <Component />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
