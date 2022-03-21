import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/auth';

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
