import "./styles/index.css";
import "./styles/App.css";

import React, { useEffect, useState, useCallback } from "react";
import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Import từ Firebase (đảm bảo đường dẫn đúng)
import { doc, getDoc } from 'firebase/firestore';

import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Notifications from './pages/Notifications';
import About from './pages/About'; // Trang About sẽ là trang chủ
import Setup from './pages/SetupInfo'; // Trang Setup
import Navbar from "./components/Navbar";
import Login from './pages/LoginPage';
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
    if (currentUser) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const setupComplete = !!userData.goalSteps;
        setIsUserSetupComplete(setupComplete);
      } else {
        setIsUserSetupComplete(false);
      }
    } else {
      setIsUserSetupComplete(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      await checkSetupCompletion(currentUser);
    });
    return () => unsubscribe();
  }, [checkSetupCompletion]);

  return (
    <div
      className="min-h-screen text-white font-poppins"
      style={{ backgroundColor: '#000000' }}
    >
      {user && isUserSetupComplete && <Navbar />}
      <main className="p-4" style={{ paddingTop: user && isUserSetupComplete ? '70px' : '0px' }}>
        <MyBreadcrumbs />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2C3E50', marginBottom: '20px' }} />

        <Routes>
          <Route
            path="/"
            element={user ? (isUserSetupComplete ? <About /> : <Navigate to="/setup" />) : <Navigate to="/login" />}
          />
          <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={isUserSetupComplete ? "/about" : "/setup"} />}
          />
          <Route
            path="/setup"
            element={
              user ? (
                <Setup
                  onSetupComplete={async () => {
                    await checkSetupCompletion(user);
                    navigate("/about");
                  }}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/tracking" element={user ? <Tracking /> : <Navigate to="/login" />} />
        
        </Routes>
      </main>
    </div>
  );
}
export default App;