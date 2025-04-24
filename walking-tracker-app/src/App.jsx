// App.js
import "./styles/index.css";
import "./styles/App.css";

// Import các styles riêng của App
import React, { useEffect, useState, useCallback } from "react";
import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';  // Import từ Firebase
import { doc, getDoc } from 'firebase/firestore';

// Import các trang
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Notifications from './pages/Notifications';
import About from './pages/About';  // Trang About sẽ là trang chủ
import LoginPage from './pages/LoginPage';  // Trang Login
import Setup from './pages/SetupInfo';  // Trang Setup
import Navbar from "./components/Navbar";

const MyBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    pathnames.push('About'); // Khi không có breadcrumb, mặc định sẽ là About
  }

  const breadcrumbStyle = { color: '#ffffff' };  // Inline style for breadcrumb color

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        marginBottom: '-20px',
        color: '#ffffff', // Apply default white color to Breadcrumbs
        '& .MuiBreadcrumbs-separator': {
          color: '#ffffff', // Style the separator
        },
      }}
    >
      {/* Dẫn đến About khi bấm vào "Pages" */}
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
        setIsUserSetupComplete(!!userData.goalSteps);
      } else {
        setIsUserSetupComplete(false);
      }
    } else {
      setIsUserSetupComplete(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      await checkSetupCompletion(user); // Gọi hàm kiểm tra khi trạng thái đăng nhập thay đổi
    });
    return () => unsubscribe();
  }, [checkSetupCompletion]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("userInfo"); // Ensure userInfo is removed on logout
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
                <LoginPage />
              ) : (
                <Navigate to={isUserSetupComplete ? "/about" : "/setup"} />
              )
            }
          />
          <Route
            path="/setup"
            element={user ? (<Setup onSetupComplete={async () => {await checkSetupCompletion(user); navigate("/about"); }} />) : (<Navigate to="/login" />)}
          />
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