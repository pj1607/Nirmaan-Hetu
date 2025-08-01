import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Home from './pages/home/Home';
import Login from './pages/login/LoginPage.jsx'
import Navbar from './components/Navbar.jsx';

import OwnerDashboard from './pages/dashboard/owner/DashboardO.jsx';
import BuilderDashboard from './pages/dashboard/builder/DashboardB.jsx';

const App = () => {
  const { isAuthenticated, user } = useAuth();

  const RequireAuth = ({ role, children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (role && user?.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Owner Routes */}
        <Route
          path="/dashboard/owner"
          element={
            <RequireAuth role="owner">
              <OwnerDashboard />
            </RequireAuth>
          }
        />

        {/* Builder Routes */}
        <Route
          path="/dashboard/builder"
          element={
            <RequireAuth role="builder">
              <BuilderDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};

export default App;
