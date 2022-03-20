import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { UIContext } from '../../Unknown/UIContext';
import mainImage from '../../../home.webp';

const SignInScreen: React.FC = () => {
  const { setAlert } = useContext(UIContext);

  const handleSignIn = React.useCallback(async () => {
    setAlert({
      show: true,
      severity: 'info',
      message: 'Sign in button was clicked.',
    });
  }, [setAlert]);

  return (
    <>
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Container fixed maxWidth="sm">
          <Grid container>
            <Grid item xs={6}>
              <img src={mainImage} alt="home" />
            </Grid>
            <Grid item xs={6}>
              <Button type="button" onClick={handleSignIn}>
                Sign in
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default SignInScreen;
