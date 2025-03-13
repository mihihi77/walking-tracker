
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDZnesSHIfrXgvNtzjJDZKgseu_LEvB3io",
  authDomain: "walking-tracker-a6a38.firebaseapp.com",
  projectId: "walking-tracker-a6a38",
  storageBucket: "walking-tracker-a6a38.firebasestorage.app",
  messagingSenderId: "362493366243",
  appId: "1:362493366243:web:4c43963222fbba7d9d5ad6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);