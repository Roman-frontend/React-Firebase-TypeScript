import React, { createContext, useState, ReactElement } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { Auth } from 'firebase/auth';
import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import firebaseApp from '../../../common/firebaseApp';
import firebaseStore from '../../../common/firebaseStore';
import firebaseStorage from '../../../common/firebaseStorage';
import firebaseAuth from '../../../common/firebaseAuth';

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProps {
  setAlert: React.Dispatch<React.SetStateAction<AlertProps>>;
  db: FirebaseApp;
  firestore: Firestore;
  firebaseStorage: FirebaseStorage;
  firebaseAuth: Auth;
}

interface AlertProps {
  show: boolean;
  severity?: AlertColor;
  message?: string;
}

export const AppContextProvider: React.FC = ({ children }): ReactElement => {
  const [alert, setAlert] = useState<AlertProps>({
    show: false,
    severity: 'info',
    message: '',
  });
  const handleClose = () =>
    setAlert({
      show: false,
    });

  return (
    <AppContext.Provider
      value={{
        setAlert,
        db: firebaseApp,
        firestore: firebaseStore,
        firebaseStorage,
        firebaseAuth,
      }}
    >
      {children}
      <Snackbar open={alert.show} autoHideDuration={4000} onClose={handleClose}>
        <Alert elevation={6} variant="filled" severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};
