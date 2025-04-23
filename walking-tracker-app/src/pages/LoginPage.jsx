import React, { useRef, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { href, Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date()
        });
        navigate("/setup"); // Chuyển đến trang Setup sau khi đăng ký
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          navigate("/dashboard");
        } else {
          navigate("/setup"); // Trường hợp user chưa có dữ liệu, chuyển đến Setup
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("Authentication Error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        navigate("/dashboard");
      } else {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date()
        });
        navigate("/setup");
      }
    } catch (error) {
      setError(error.message);
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div>
      <h1>{isSignUp ? "Sign Up to Momentum" : "Sign In to Momentum"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAuth}>
        <p>Email Adress</p>
        <input className="input-group" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <p>Password</p>
        <input className="input-group" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="sign-in-btn" type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>
      <button onClick={handleGoogleLogin}>Sign In with Google</button>
    </div>
  );
};

export default LoginPage;
