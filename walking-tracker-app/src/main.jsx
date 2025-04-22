import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import App from './App.jsx'
// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';

// Render TestLogin thay vì App
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />  {/* Thay thế App bằng TestLogin để thử nghiệm */}
    </React.StrictMode>
  </BrowserRouter>
);
