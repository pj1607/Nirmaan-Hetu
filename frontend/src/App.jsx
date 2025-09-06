import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import {
  Box,
} from '@mui/material';

import Home from './pages/home/Home';
import Login from './pages/login/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { Toaster } from "react-hot-toast";

import OwnerDashboard from './pages/dashboard/owner/DashboardO.jsx';
import BuilderDashboard from './pages/dashboard/builder/DashboardB.jsx';
import OAuthSuccess from './pages/OAuthSuccess.jsx';
import ViewBuilderPage from './pages/ViewBuilderPage.jsx';

const App = () => {
  const { isLoggedIn, role, loading } = useAuth();

  if (loading) return null; 

  const RequireAuth = ({ requiredRole, children }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (isLoggedIn) {
      if (role === 'owner') return <Navigate to="/owner-dashboard" replace />;
      if (role === 'builder') return <Navigate to="/builder-dashboard" replace />;
    }
    return children;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",  
      }}
    >
       <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
        }} 
      />
      <Navbar />
      <Routes>
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route
          path="/owner-dashboard"
          element={
            <RequireAuth requiredRole="owner">
              <OwnerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/owner-dashboard/view/:id"
          element={
            <RequireAuth requiredRole="owner">
              <ViewBuilderPage />
            </RequireAuth>
          }
        />
        <Route
          path="/builder-dashboard"
          element={
            <RequireAuth requiredRole="builder">
              <BuilderDashboard />
            </RequireAuth>
          }
        />
      </Routes>
 </Box>
  );
};

export default App;
