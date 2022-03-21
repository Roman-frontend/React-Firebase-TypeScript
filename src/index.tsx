import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import firebaseApp from './common/firebaseApp';

import reportWebVitals from './reportWebVitals';
import App from './components/Unknown/App';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseApp={firebaseApp}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
