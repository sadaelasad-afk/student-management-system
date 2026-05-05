import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Specializations from './pages/Specializations';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/students" 
          element={isLoggedIn ? <Students /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/attendance" 
          element={isLoggedIn ? <Attendance /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/specializations" 
          element={isLoggedIn ? <Specializations /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
