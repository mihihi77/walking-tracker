import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await handleUserRedirect(result.user);
        }
      } catch (err) {
        console.error("Redirect error:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !localStorage.getItem("userLoggedIn")) {
        await handleUserRedirect(user);
      }
    });

    checkRedirectResult();

    return () => unsubscribe();
  }, [navigate]);

  const handleUserRedirect = async (user) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    localStorage.setItem("userLoggedIn", true);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData && userData.goalSteps) {
        setRedirectPath("/about");
      } else {
        setRedirectPath("/setup");
      }
    } else {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      // localStorage.setItem("userLoggedIn", true);
      setRedirectPath("/setup");
    }
  };

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
          createdAt: new Date(),
        });
        localStorage.setItem("userLoggedIn", true);
        localStorage.setItem("justRegistered", "true");
        setRedirectPath("/setup");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          localStorage.setItem("userLoggedIn", true);
          const userData = userDoc.data();
          if (userData && userData.goalSteps) {
            setRedirectPath("/about");
          } else {
            setRedirectPath("/setup");
          }
        } else {
          setRedirectPath("/setup");
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("Authentication Error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      setError(error.message);
      console.error("Google Redirect Error:", error);
    }
  };

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[#171717] rounded-lg shadow-md overflow-hidden max-w-2xl w-full text-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:block">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="login form"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faCubes} className="text-gray-400 text-3xl mr-3" />
              <span className="text-2xl font-bold text-gray-400">WalkMate</span>
            </div>
            <h5 className="text-xl font-bold text-gray-400 mb-4 tracking-wide">
              {isSignUp ? "Sign up for your account" : "Sign in to your account"}
            </h5>
            {error && <p className="text-red-500 font-bold mb-2">{error}</p>}
            <form onSubmit={handleAuth}>
              <div className="mb-4">
                <label htmlFor="email" className="block font-bold text-white text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-[#12a245] bg-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block font-bold text-white text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-[#12a245] bg-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="bg-[#12a245] hover:bg-[#12a245] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-2"
                type="submit"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>
            <a href="#!" className="inline-block align-baseline text-sm text-gray-400 hover:text-[#12a245] mb-2">
              Forgot password?
            </a>
            <p className="text-center text-gray-400 text-sm mb-4">
              {isSignUp ? (
                <>
                  Already have an account?
                  <button
                    type="button"
                    className="font-bold text-[#12a245] hover:text-[#12a245] ml-1"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?
                  <button
                    type="button"
                    className="font-bold text-[#12a245] hover:text-[#12a245] ml-1"
                    onClick={() => setIsSignUp(true)}
                  >
                    Register here
                  </button>
                </>
              )}
            </p>
            <button
              onClick={handleGoogleLogin}
              className="bg-[#12a245] hover:bg-[#12a245] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In with Google
            </button>
            <div className="mt-4 text-center text-gray-500 text-xs">
              <a href="#!" className="mr-2 hover:text-[#12a245]">Terms of use</a>
              <a href="#!" className="hover:text-[#12a245]">Privacy policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
