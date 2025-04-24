import "./styles/index.css";
import "./styles/App.css";

import React, { useEffect, useState, useCallback } from "react";
import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Login from './pages/LoginPage';
import Setup from './pages/SetupInfo'; // Đảm bảo import đúng tên file
import Profile from './pages/ProfilePage';

const MyBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    pathnames.push('About');
  }

  const breadcrumbStyle = { color: '#ffffff' };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        marginBottom: '-20px',
        color: '#ffffff',
        '& .MuiBreadcrumbs-separator': {
          color: '#ffffff',
        },
      }}
    >
      <Link to="/about" style={breadcrumbStyle}>
        Pages
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
          <Link key={to} to={to} style={breadcrumbStyle}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isUserSetupComplete, setIsUserSetupComplete] = useState(false);

  const checkSetupCompletion = useCallback(async (currentUser) => {
    console.log("App.js: checkSetupCompletion called with user:", currentUser?.uid);
    if (currentUser) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const setupComplete = !!userData.goalSteps;
        setIsUserSetupComplete(setupComplete);
        console.log("App.js: User data exists:", userData, "isUserSetupComplete set to:", setupComplete);
      } else {
        setIsUserSetupComplete(false);
        console.log("App.js: User data does not exist, isUserSetupComplete set to: false");
      }
    } else {
      setIsUserSetupComplete(false);
      console.log("App.js: No user logged in, isUserSetupComplete set to: false");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      console.log("App.js: onAuthStateChanged - User:", currentUser?.uid);
      await checkSetupCompletion(currentUser);
      console.log("App.js: onAuthStateChanged - isUserSetupComplete:", isUserSetupComplete);
    });
    return () => unsubscribe();
  }, [checkSetupCompletion]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("justRegistered");
      sessionStorage.clear();
      window.location.href = '/login';
    });
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#000000' }}>
      {user && isUserSetupComplete && <Navbar />}

      <main className="p-4" style={{ paddingTop: user && isUserSetupComplete ? '70px' : '0px' }}>
        <MyBreadcrumbs />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2C3E50', marginBottom: '20px' }} />

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                isUserSetupComplete ? (
                  <About />
                ) : (
                  <Navigate to="/setup" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : (
                <Navigate to={isUserSetupComplete ? "/about" : "/setup"} />
              )
            }
          />
          <Route
            path="/setup"
            element={user ? <Setup onSetupComplete={checkSetupCompletion} /> : <Navigate to="/login" />}
          />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/tracking" element={user ? <Tracking /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
        </Routes>
        {user && (
          <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#12a245', color: '#fff' }}>
            Logout
          </button>
        )}
      </main>
    </div>
  );
}

export default App;