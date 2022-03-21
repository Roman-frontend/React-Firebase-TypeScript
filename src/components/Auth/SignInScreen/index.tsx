import React, { useCallback, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { AppContext } from '../../Unknown/AppContext';
import mainImage from '../../../auth-image.png';
import voypostIcon from '../../../voypost.png';
import PaswordInput from './PaswordInputAuth';
import EmailInput from './EmailInputAuth';

const SignInScreen: React.FC = () => {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setAlert, authApp } = useContext(AppContext);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Too Long')
      .required('Required'),
  });

  useEffect(() => {
    if (!email || !password) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  }, [email, password]);

  const onSubmit = useCallback(
    async (value) => {
      setDisabledSubmit(true);
      try {
        await signInWithEmailAndPassword(authApp, value.email, value.password);

        setAlert({
          show: true,
          severity: 'success',
          message: `Succes login`,
        });
      } catch (e) {
        setEmail('');
        setPassword('');
        setAlert({
          show: true,
          severity: 'error',
          message: `${e}`,
        });
        setDisabledSubmit(false);
      }
    },
    [setAlert, authApp],
  );

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
                <Formik
                  initialValues={{ email, password }}
                  enableReinitialize
                  validationSchema={validationSchema}
                  onSubmit={(value) => onSubmit(value)}
                >
                  <Form>
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: 30,
                        fontWeight: 'bold',
                      }}
                    >
                      Login
                    </span>
                    <EmailInput email={email} setEmail={setEmail} />
                    <PaswordInput
                      password={password}
                      setPassword={setPassword}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      style={{
                        width: '70%',
                        margin: '15px',
                        background: 'red',
                      }}
                      disabled={disabledSubmit}
                      type="submit"
                    >
                      Enter
                    </Button>
                  </Form>
                </Formik>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default SignInScreen;
