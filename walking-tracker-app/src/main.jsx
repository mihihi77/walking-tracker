// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import TestLogin from './TestLogin'; // Đảm bảo đường dẫn chính xác

// Render TestLogin thay vì App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestLogin />  {/* Thay thế App bằng TestLogin để thử nghiệm */}
  </React.StrictMode>
);
