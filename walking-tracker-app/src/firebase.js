import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZnesSHIfrXgvNtzjJDZKgseu_LEvB3io",
  authDomain: "walking-tracker-a6a38.firebaseapp.com",
  projectId: "walking-tracker-a6a38",
  storageBucket: "walking-tracker-a6a38.firebasestorage.app",
  messagingSenderId: "362493366243",
  appId: "1:362493366243:web:4c43963222fbba7d9d5ad6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const messaging = getMessaging(app);

export { app, db, auth, googleProvider, messaging };