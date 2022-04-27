import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User, createUserWithEmailAndPassword } from 'firebase/auth';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from 'reactfire';
import Button from '@mui/material/Button';
import { AppContext } from '../../Unknown/AppContext';
import PaswordInput from '../PaswordInputAuth';
import InfoInput from '../InputAuth';
import EmailInput from '../EmailInputAuth';
import firebaseStore from '../../../common/firebaseStore';

const SignUpScreen: React.FC = () => {
  const navigate = useNavigate();
  const [disabledRegisterSubmit, setDisabledRegisterSubmit] =
    useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setAlert } = useContext(AppContext);
  const authApp = useAuth();

  const validateSimpleText = Yup.string()
    .min(2, 'Too Short!')
    .max(15, 'Too Long')
    .required('Required');

  const validationSchema = Yup.object({
    name: validateSimpleText,
    surname: validateSimpleText,
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: validateSimpleText,
  });

  useEffect(() => {
    if (email && password && name && surname) {
      setDisabledRegisterSubmit(false);
    } else {
      setDisabledRegisterSubmit(true);
    }
  }, [name, surname, email, password]);

  const addUserInfo = useCallback(
    async (user: User) => {
      if (user?.uid) {
        const docRef = doc(firebaseStore, `usersInfo`, user.uid);
        const docSnap = await getDoc(docRef);

        await setDoc(docRef, {
          ...docSnap.data(),
          name,
          surname,
          uid: user.uid,
          images: [],
        });
      }
    },
    [name, surname],
  );

  const onSubmit = useCallback(async () => {
    setDisabledRegisterSubmit(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        authApp,
        email,
        password,
      );

      console.log('user => ', user);
      addUserInfo(user);
      setAlert({ show: true, severity: 'success', message: `Succes register` });
    } catch (e) {
      setEmail('');
      setPassword('');
      setAlert({ show: true, severity: 'error', message: `${e}` });
      setDisabledRegisterSubmit(false);
    }
  }, [setAlert, authApp, email, password, addUserInfo]);

  return (
    <>
      <Formik
        initialValues={{ email, password, name, surname }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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
          <InfoInput name="name" state={name} setState={setName} />
          <InfoInput name="surname" state={surname} setState={setSurname} />
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
            disabled={disabledRegisterSubmit}
            type="submit"
          >
            Sign up
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
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default SignUpScreen;
