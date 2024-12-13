import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC6mmUk8v9Pwp7upeb5Qscc1vOz_QAkMGI",
  authDomain: "black-function-380411.firebaseapp.com",
  databaseURL: "https://black-function-380411-default-rtdb.firebaseio.com",
  projectId: "black-function-380411",
  storageBucket: "black-function-380411.appspot.com",
  messagingSenderId: "262010279934",
  appId: "1:262010279934:android:b176a5a796529350df12af",
  measurementId: "G-SOMEID" // Optional
};

// Initialize Firebase only if no apps are initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getDatabase(app);

export { db };
