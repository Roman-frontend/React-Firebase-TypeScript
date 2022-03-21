import React, { createContext, useState } from 'react';
import { getAuth, Auth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { useFirebaseApp } from 'reactfire';
import { getDatabase, Database } from 'firebase/database';
import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProps {
  setAlert: React.Dispatch<React.SetStateAction<AlertProps>>;
  firebaseApp: Database;
  authApp: Auth;
  firestoreApp: Firestore;
}

interface AlertProps {
  show: boolean;
  severity?: AlertColor;
  message?: string;
}

export const AppContextProvider: React.FC = ({ children }) => {
  const app = useFirebaseApp();
  const firebaseApp = getDatabase(app);
  const authApp = getAuth(app);
  const firestoreApp = getFirestore(useFirebaseApp());

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
      value={{ setAlert, firebaseApp, authApp, firestoreApp }}
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
