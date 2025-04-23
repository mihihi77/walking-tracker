import "./styles/index.css";
import "./styles/App.css";

// Import các styles riêng của App
import React from 'react';
import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import các trang
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Notifications from './pages/Notifications';
import About from './pages/About';  // Trang About sẽ là trang chủ


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
        marginBottom: '16px',
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
  return (
    <div className=" min-h-screen text-white" style={{ backgroundColor: '#000000' }}>
      <Navbar />
      <main className="p-4" style={{ paddingTop: '70px' }}> {/* Thêm khoảng cách giữa navbar và nội dung */}
        {/* Hiển thị Breadcrumbs (Đường dẫn trang) */}
        <MyBreadcrumbs />
        
        {/* Tiêu đề trang */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2C3E50', marginBottom: '20px' }}>
          {/* Tiêu đề sẽ thay đổi khi người dùng chuyển qua các trang */}
        </Typography>

        {/* Cấu hình routes */}
        <Routes>
          <Route path="/" element={<About />} />   {/* Trang About là trang chủ */}
          <Route path="/about" element={<About />} /> {/* Trang About */}
          <Route path="/Dashboard" element={<Dashboard />} />  {/* Trang Home */}
          <Route path="/tracking" element={<Tracking />} />  
          <Route path="/notifications" element={<Notifications />} />  
        </Routes>
      </main>
    </div>
  );
}

export default App;
