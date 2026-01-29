// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import ViewAllPhotos from './components/ViewAllPhotos';
import UploadPhoto from './components/UploadPhoto';
import ViewPhotos from './components/ViewPhotos';
import PhotoDetails from './components/photoDetails';
import Profile from './components/profile';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/ViewAllPhotos" element={isAuthenticated ? <ViewAllPhotos /> : <Navigate to="/login" />} />
          <Route path="/upload" element={isAuthenticated ? <UploadPhoto /> : <Navigate to="/login" />} />
          <Route path="/view" element={isAuthenticated ? <ViewPhotos /> : <Navigate to="/login" />} />
          <Route path="/photoDetails" element={isAuthenticated ? <PhotoDetails /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <ViewAllPhotos /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;