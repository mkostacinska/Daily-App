import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FIREBASE_APIKEY } from '@env'

const firebaseConfig = {
    apiKey: FIREBASE_APIKEY,
    authDomain: "daily-app-8b41e.firebaseapp.com",
    projectId: "daily-app-8b41e",
    storageBucket: "daily-app-8b41e.appspot.com",
    messagingSenderId: "453447102474",
    appId: "1:453447102474:web:3ccf16034139cdc1836ff3",
    measurementId: "G-Q8VXK7GDZ5"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };