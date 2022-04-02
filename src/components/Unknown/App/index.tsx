import React, { ReactElement } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  FirestoreProvider,
  AuthProvider,
  DatabaseProvider,
  useFirebaseApp,
} from 'reactfire';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import theme from '../../../common/theme';
import Root from '../Root';
import { AppContextProvider } from '../AppContext';

const App: React.FC = (): ReactElement => {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  const database = getDatabase(app);

  // //Emulators
  // // Check for dev/test mode however your app tracks that.
  // // `process.env.NODE_ENV` is a common React pattern
  // if (process.env.NODE_ENV !== 'production') {
  //   // Set up emulators
  //   connectFirestoreEmulator(firestoreInstance, 'localhost', 8080);
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectDatabaseEmulator(database, 'localhost', 9000);
  // }

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <DatabaseProvider sdk={database}>
          <ThemeProvider theme={theme}>
            <Router basename={process.env.PUBLIC_URL || '/'}>
              <CssBaseline />
              <AppContextProvider>
                <Root />
              </AppContextProvider>
            </Router>
          </ThemeProvider>
        </DatabaseProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
};

export default App;
