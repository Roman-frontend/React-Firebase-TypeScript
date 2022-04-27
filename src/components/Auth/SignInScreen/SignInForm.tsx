import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'reactfire';
import Button from '@mui/material/Button';
import { AppContext } from '../../Unknown/AppContext';
import PaswordInput from '../PaswordInputAuth';
import EmailInput from '../EmailInputAuth';

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [disabledLoginSubmit, setDisabledLoginSubmit] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setAlert } = useContext(AppContext);
  const authApp = useAuth();
  const provider = new GoogleAuthProvider();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Too Long')
      .required('Required'),
  });

  useEffect(() => {
    if (email && password) {
      setDisabledLoginSubmit(false);
    } else {
      setDisabledLoginSubmit(true);
    }
  }, [email, password]);

  const onSubmit = useCallback(
    async (value) => {
      setDisabledLoginSubmit(true);
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
        setDisabledLoginSubmit(false);
      }
    },
    [setAlert, authApp],
  );

  const loginGogleWithoutPopupInTheWindow = async () => {
    // signInWithPopup - Щоб відкрити окрему вкладку з вибором облікових записів гугл
    signInWithPopup(authApp, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const { user } = result;
        console.log('token: ', token, 'user: ', user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const { email: errorEmail } = error;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(
          'The AuthCredential type that was used: ',
          credential,
          'errorEmail: ',
          errorEmail,
          'errorCode: ',
          errorCode,
          'errorMessage: ',
          errorMessage,
        );
      });
  };

  function loginGogleWithPopupInTheWindow() {
    signInWithRedirect(authApp, provider);
    getRedirectResult(authApp)
      .then((result) => {
        if (result) {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;

          // The signed-in user info.
          const user = result?.user;
          console.log(token, user);
        } else {
          throw new Error('some after login with gogle');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
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
          <PaswordInput password={password} setPassword={setPassword} />
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{
              width: '70%',
              margin: '15px',
              background: 'red',
            }}
            disabled={disabledLoginSubmit}
            type="submit"
          >
            Sign in
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{
              width: '70%',
              margin: '15px',
              background: 'red',
            }}
            onClick={() => navigate('/register')}
          >
            Sign up
          </Button>
          <Button
            onClick={() => loginGogleWithPopupInTheWindow()}
            variant="outlined"
          >
            Войти с помощью Google в етом окне
          </Button>

          <Button
            onClick={loginGogleWithoutPopupInTheWindow}
            variant="outlined"
            style={{ marginTop: 5 }}
          >
            Войти с помощью Google в новом окне
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default SignInForm;
