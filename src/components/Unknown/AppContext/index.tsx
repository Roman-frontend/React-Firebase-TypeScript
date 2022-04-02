import React, { createContext, useState, ReactElement } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProps {
  setAlert: React.Dispatch<React.SetStateAction<AlertProps>>;
  isRegisteredNow: boolean;
  setIsRegisteredNow: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AlertProps {
  show: boolean;
  severity?: AlertColor;
  message?: string;
}

export const AppContextProvider: React.FC = ({ children }): ReactElement => {
  const [isRegisteredNow, setIsRegisteredNow] = useState<boolean>(false);
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
      value={{ setAlert, isRegisteredNow, setIsRegisteredNow }}
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
