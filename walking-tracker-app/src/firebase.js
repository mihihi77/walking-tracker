
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";


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
const db = getFirestore(app);
const auth = getAuth(app); // Nếu bạn sử dụng Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Nếu bạn sử dụng Google Authentication
const facebookProvider = new FacebookAuthProvider(); // Nếu bạn sử dụng Facebook Authentication
const githubProvider = new GithubAuthProvider(); // Nếu bạn sử dụng Github Authentication
const provider = new GoogleAuthProvider(); // Nếu bạn sử dụng Google Authentication

export { db, auth, googleProvider, facebookProvider, githubProvider, provider, firestore };
