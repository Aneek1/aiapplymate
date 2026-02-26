import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ResumeManager from './sections/ResumeManager';
import JobPreferences from './sections/JobPreferences';
import ApplicationsPage from './pages/Applications';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Register from './pages/Register';

import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Auth Routes */}
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
    </AuthProvider>
  );
}

export default App;
