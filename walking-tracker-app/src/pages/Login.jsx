import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">Login</h2>
      <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">
        Login with Google
      </button>
    </div>
  );
};

export default Login;

