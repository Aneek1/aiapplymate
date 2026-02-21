import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ResumeManager from './sections/ResumeManager';
import JobPreferences from './sections/JobPreferences';
import ApplicationsPage from './pages/Applications';
import Layout from './components/layout/Layout';

// Simple placeholder for auth pages (bypass for now)
const Login = () => <Navigate to="/dashboard" replace />;
const Register = () => <Navigate to="/dashboard" replace />;

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - redirect to dashboard */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main App Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="resume-manager" element={<ResumeManager />} />
          <Route path="preferences" element={<JobPreferences />} />
          <Route path="applications" element={<ApplicationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
