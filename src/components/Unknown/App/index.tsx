import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from 'firebase/auth';
import theme from '../../../common/theme';
import Root from '../Root';
import { AppContextProvider } from '../AppContext';

const App: React.FC = () => {
  const app = useFirebaseApp();
  const auth = getAuth(app);

  return (
    <AuthProvider sdk={auth}>
      <ThemeProvider theme={theme}>
        <Router basename={process.env.PUBLIC_URL || '/'}>
          <CssBaseline />
          <AppContextProvider>
            <Root />
          </AppContextProvider>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
