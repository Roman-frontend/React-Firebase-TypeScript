import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { FirebaseAppProvider, AuthProvider, DatabaseProvider } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../../../common/firebaseApp';
import theme from '../../../common/theme';
import Root from '../Root';
import { UIContextProvider } from '../UIContext';

const App: React.FC = () => {
  const auth = getAuth(firebaseApp);

  return (
    <FirebaseAppProvider firebaseApp={firebaseApp}>
      <AuthProvider sdk={auth}>
        <ThemeProvider theme={theme}>
          <Router basename={process.env.PUBLIC_URL || '/'}>
            <CssBaseline />
            <UIContextProvider>
              <Root />
            </UIContextProvider>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
};

export default App;
